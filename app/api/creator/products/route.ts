import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { verifySessionToken } from "@/app/lib/auth";
import { ResultSetHeader, RowDataPacket } from "mysql2";

async function getCreator(request: NextRequest) {
  const token = request.cookies.get("master_market_session")?.value;

  if (!token) return null;

  const user = await verifySessionToken(token);

  if (!user || user.role !== "creator") return null;

  return user;
}

// GET - View creator's products
export async function GET(request: NextRequest) {
  try {
    const creator = await getCreator(request);

    if (!creator) {
      return NextResponse.json(
        { success: false, message: "Creator login required." },
        { status: 401 }
      );
    }

    const [products] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM products
       WHERE creator_id = ?
       ORDER BY product_id DESC`,
      [creator.user_id]
    );

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get creator products error:", error);

    return NextResponse.json(
      { success: false, message: "Could not load products." },
      { status: 500 }
    );
  }
}

// POST - Add new product
export async function POST(request: NextRequest) {
  try {
    const creator = await getCreator(request);

    if (!creator) {
      return NextResponse.json(
        { success: false, message: "Creator login required." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const productBody = body as Record<string, unknown>;

    const productName = String(productBody.product_name || "").trim();
    const description = String(productBody.description || "").trim();
    const price = Number(productBody.price);
    const image = String(productBody.image || "").trim();
    const categoryId = Number(productBody.category_id);

    if (!productName || !description || !Number.isFinite(price) ||
        price <= 0 || !Number.isInteger(categoryId) || categoryId <= 0) {
      return NextResponse.json(
        { success: false, message: "Enter valid product details." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products
       (product_name, description, price, image, category_id, creator_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productName,
        description,
        price,
        image || null,
        categoryId,
        creator.user_id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product added successfully.",
      product_id: result.insertId,
    });
  } catch (error) {
    console.error("Add product error:", error);

    return NextResponse.json(
      { success: false, message: "Could not add product." },
      { status: 500 }
    );
  }
}

// PUT - Edit creator's product
export async function PUT(request: NextRequest) {
  try {
    const creator = await getCreator(request);

    if (!creator) {
      return NextResponse.json(
        { success: false, message: "Creator login required." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const productBody = body as Record<string, unknown>;

    const productId = Number(productBody.product_id);
    const productName = String(productBody.product_name || "").trim();
    const description = String(productBody.description || "").trim();
    const price = Number(productBody.price);
    const image = String(productBody.image || "").trim();
    const categoryId = Number(productBody.category_id);

    if (
      !Number.isInteger(productId) || productId <= 0 ||
      !productName || !description ||
      !Number.isFinite(price) || price <= 0 ||
      !Number.isInteger(categoryId) || categoryId <= 0
    ) {
      return NextResponse.json(
        { success: false, message: "Enter valid product details." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE products
       SET product_name = ?, description = ?, price = ?,
           image = ?, category_id = ?
       WHERE product_id = ? AND creator_id = ?`,
      [
        productName,
        description,
        price,
        image || null,
        categoryId,
        productId,
        creator.user_id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { success: false, message: "Could not update product." },
      { status: 500 }
    );
  }
}

// DELETE - Delete creator's product
export async function DELETE(request: NextRequest) {
  try {
    const creator = await getCreator(request);

    if (!creator) {
      return NextResponse.json(
        { success: false, message: "Creator login required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = Number(searchParams.get("product_id"));

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid product ID required." },
        { status: 400 }
      );
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `DELETE FROM products
       WHERE product_id = ? AND creator_id = ?`,
      [productId, creator.user_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      { success: false, message: "Could not delete product." },
      { status: 500 }
    );
  }
}