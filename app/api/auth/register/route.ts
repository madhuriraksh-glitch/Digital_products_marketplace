import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/app/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const requestedRole = String(body.role || "customer").toLowerCase();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const role =
      requestedRole === "creator" ? "creator" : "customer";

    const [existing]: any = await pool.execute(
      "SELECT user_id FROM `User` WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result]: any = await pool.execute(
      `INSERT INTO \`User\`
       (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful.",
        user: {
          user_id: result.insertId,
          name,
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);

    return NextResponse.json(
      { success: false, message: "Registration failed." },
      { status: 500 }
    );
  }
}