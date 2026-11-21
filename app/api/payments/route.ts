import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/app/lib/db";
import { verifySessionToken } from "@/app/lib/auth";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type OrderRow = RowDataPacket & {
  order_id: number;
  user_id: number;
  total_amount: number;
};

function getGateway(country: string) {
  const normalizedCountry = country.trim().toLowerCase();

  if (normalizedCountry === "sri lanka") {
    return { gateway: "PayHere", currency: "LKR" };
  }

  if (normalizedCountry === "india") {
    return { gateway: "Razorpay", currency: "INR" };
  }

  return { gateway: "Stripe", currency: "USD" };
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("master_market_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const customer = await verifySessionToken(token);

    if (!customer || customer.role !== "customer") {
      return NextResponse.json(
        { success: false, message: "Customer access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const orderId = Number(body.order_id);
    const country = String(body.country || "").trim();

    if (!Number.isInteger(orderId) || orderId <= 0 || !country) {
      return NextResponse.json(
        { success: false, message: "Valid order ID and country are required." },
        { status: 400 }
      );
    }

    const [orders] = await pool.execute<OrderRow[]>(
      `SELECT order_id, user_id, total_amount
       FROM orders
       WHERE order_id = ? AND user_id = ?
       LIMIT 1`,
      [orderId, customer.user_id]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const order = orders[0];
    const payment = getGateway(country);

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO payments
       (order_id, payment_gateway, amount, currency, payment_status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        order.order_id,
        payment.gateway,
        order.total_amount,
        payment.currency,
        "pending",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Payment record created successfully.",
      payment_id: result.insertId,
      order_id: order.order_id,
      gateway: payment.gateway,
      currency: payment.currency,
      amount: order.total_amount,
      payment_status: "pending",
    });
  } catch (error) {
    console.error("Payment API error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create payment record." },
      { status: 500 }
    );
  }
}