import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("mm_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not logged in." },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Session expired." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to verify session." },
      { status: 500 }
    );
  }
}