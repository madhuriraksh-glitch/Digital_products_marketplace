import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.product_name,
        p.description,
        p.price,
        p.image,
        c.category_name
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.category_id
    `);

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      product_name,
      description,
      price,
      image,
      category_id,
      creator_id,
    } = body;

    if (!product_name || price === undefined || Number(price) <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid product name and price are required" },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `INSERT INTO products
       (product_name, description, price, image, category_id, creator_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product_name,
        description || null,
        Number(price),
        image || null,
        category_id || null,
        creator_id || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product_id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to add product" },
      { status: 500 }
    );
  }
}
  export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("id");

    const body = await request.json();
    const { product_name, description, price } = body;

    if (!product_id || !product_name || price === undefined || Number(price) <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid product ID, name and price are required" },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `UPDATE products
       SET product_name = ?, description = ?, price = ?
       WHERE product_id = ?`,
      [product_name, description || null, Number(price), product_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to update product" },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("id");

    if (!product_id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      "DELETE FROM products WHERE product_id = ?",
      [product_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Unable to delete product" },
      { status: 500 }
    );
  }
}