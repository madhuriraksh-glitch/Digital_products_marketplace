import { NextResponse } from "next/server";
import pool from "../../lib/db";

// GET - Fetch all categories
export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT category_id, category_name
       FROM categories
       ORDER BY category_id ASC`
    );

    return NextResponse.json({
      success: true,
      categories: rows,
    });
  } catch (error) {
    console.error("GET Categories Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch categories",
      },
      { status: 500 }
    );
  }
}

// POST - Add a new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_name } = body;

    if (
      typeof category_name !== "string" ||
      !category_name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid category name is required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `INSERT INTO categories (category_name)
       VALUES (?)`,
      [category_name.trim()]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category added successfully",
        category_id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Category Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to add category",
      },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get("id");

    const body = await request.json();
    const { category_name } = body;

    if (
      !category_id ||
      !Number.isInteger(Number(category_id)) ||
      Number(category_id) <= 0 ||
      typeof category_name !== "string" ||
      !category_name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid category ID and name are required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `UPDATE categories
       SET category_name = ?
       WHERE category_id = ?`,
      [category_name.trim(), Number(category_id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("PUT Category Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update category",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get("id");

    if (
      !category_id ||
      !Number.isInteger(Number(category_id)) ||
      Number(category_id) <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid category ID is required",
        },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `DELETE FROM categories
       WHERE category_id = ?`,
      [Number(category_id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Category Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete category",
      },
      { status: 500 }
    );
  }
}
