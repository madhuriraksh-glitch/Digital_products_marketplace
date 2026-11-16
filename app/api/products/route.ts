import { NextResponse } from "next/server";
import pool from "../../lib/db";

// GET - Fetch all products
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
      ORDER BY p.product_id DESC
    `);

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error("GET Products Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch products",
      },
      { status: 500 }
    );
  }
}

// POST - Add a new product
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

    if (
      typeof product_name !== "string" ||
      !product_name.trim() ||
      price === undefined ||
      price === null ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid product name and price are required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `INSERT INTO products
       (product_name, description, price, image, category_id, creator_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product_name.trim(),
        description ?? null,
        Number(price),
        image ?? null,
        category_id ?? null,
        creator_id ?? null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product_id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add product",
      },
      { status: 500 }
    );
  }
}

// PUT - Update an existing product
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("id");

    const body = await request.json();

    const { product_name, description, price } = body;

    if (
      !product_id ||
      !Number.isInteger(Number(product_id)) ||
      Number(product_id) <= 0 ||
      typeof product_name !== "string" ||
      !product_name.trim() ||
      price === undefined ||
      price === null ||
      !Number.isFinite(Number(price)) ||
      Number(price) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid product ID, name and price are required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `UPDATE products
       SET product_name = ?, description = ?, price = ?
       WHERE product_id = ?`,
      [
        product_name.trim(),
        description ?? null,
        Number(price),
        Number(product_id),
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("PUT Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update product",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("id");

    if (
      !product_id ||
      !Number.isInteger(Number(product_id)) ||
      Number(product_id) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid product ID is required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      "DELETE FROM products WHERE product_id = ?",
      [Number(product_id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Product Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete product",
      },
      { status: 500 }
    );
  }
}