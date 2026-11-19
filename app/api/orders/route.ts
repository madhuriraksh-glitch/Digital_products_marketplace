import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/app/lib/db";
import { verifySessionToken } from "@/app/lib/auth";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type ProductRow = RowDataPacket & {
  product_id: number;
  product_name: string;
  price: string | number;
};

type OrderItem = {
  product_id: number;
  quantity: number;
};

async function getCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get("master_market_session")?.value;

  if (!token) return null;

  const user = await verifySessionToken(token);

  if (!user || user.role !== "customer") return null;

  return user;
}

export async function POST(request: NextRequest) {
  const connection = await pool.getConnection();

  try {
    const customer = await getCustomer();

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Please login as a customer." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const items: OrderItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json(
        { success: false, message: "Invalid order items." },
        { status: 400 }
      );
    }

    const quantities = new Map<number, number>();

    for (const item of items) {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(productId) ||
        productId <= 0 ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        quantity > 100
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid product or quantity." },
          { status: 400 }
        );
      }

      quantities.set(
        productId,
        (quantities.get(productId) || 0) + quantity
      );
    }

    const productIds = Array.from(quantities.keys());
    const placeholders = productIds.map(() => "?").join(",");

    await connection.beginTransaction();

    const [products] = await connection.execute<ProductRow[]>(
      `SELECT product_id, product_name, price
       FROM products
       WHERE product_id IN (${placeholders})
       FOR UPDATE`,
      productIds
    );

    if (products.length !== productIds.length) {
      throw new Error("One or more products were not found.");
    }

    let totalCents = 0;

    const orderItems = products.map((product) => {
      const quantity = quantities.get(product.product_id)!;
      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error("Invalid product price.");
      }

      const priceCents = Math.round(price * 100);
      totalCents += priceCents * quantity;

      return {
        product_id: product.product_id,
        quantity,
        price: priceCents / 100,
      };
    });

    const totalAmount = totalCents / 100;

    const [orderResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO orders (user_id, total_amount)
       VALUES (?, ?)`,
      [customer.user_id, totalAmount]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
        ]
      );
    }

    await connection.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        order_id: orderId,
        total_amount: totalAmount,
        items: orderItems,
      },
      { status: 201 }
    );
  } catch (error) {
    await connection.rollback();

    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create order.",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}