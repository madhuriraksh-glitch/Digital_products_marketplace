import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS database_name");

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      data: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 }
    );
  }
}