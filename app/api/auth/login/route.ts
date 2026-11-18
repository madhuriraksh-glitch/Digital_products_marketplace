import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/app/lib/db";
import { RowDataPacket } from "mysql2";
import { createSessionToken, SessionUser } from "@/app/lib/auth";

interface UserRow extends RowDataPacket {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: "customer" | "creator" | "admin";
}

export async function POST(request: NextRequest) {
  try {
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

    const { email: emailValue, password: passwordValue } = body as {
      email?: unknown;
      password?: unknown;
    };

    const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
    const password = typeof passwordValue === "string" ? passwordValue : "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute<UserRow[]>(
      `SELECT user_id, name, email, password, role
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const databaseUser = rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      databaseUser.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user: SessionUser = {
      user_id: databaseUser.user_id,
      name: databaseUser.name,
      email: databaseUser.email,
      role: databaseUser.role,
    };

    const token = await createSessionToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user,
    });

    response.cookies.set("master_market_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}