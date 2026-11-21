import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import pool from "@/app/lib/db";
import { verifySessionToken } from "@/app/lib/auth";
import supabaseAdmin from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

const BUCKET_NAME = "digital-products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // 1. Check customer login
    const cookieStore = await cookies();
    const token = cookieStore.get("master_market_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const user = await verifySessionToken(token);

    if (!user || user.role !== "customer") {
      return NextResponse.json(
        { error: "Only logged-in customers can download products." },
        { status: 403 }
      );
    }

    // 2. Get file ID
    const { fileId } = await params;
    const id = Number(fileId);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "Invalid file ID." },
        { status: 400 }
      );
    }

    // 3. Verify that the customer purchased the product
    // and that its payment has been verified as paid.
    const [rows]: any = await pool.execute(
      `SELECT pf.file_path, pf.file_name
       FROM product_files pf
       INNER JOIN order_items oi
         ON oi.product_id = pf.product_id
       INNER JOIN orders o
         ON o.order_id = oi.order_id
       WHERE pf.file_id = ?
         AND o.user_id = ?
         AND EXISTS (
           SELECT 1
           FROM payments p
           WHERE p.order_id = o.order_id
             AND p.payment_status = 'paid'
         )
       LIMIT 1`,
      [id, user.user_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        {
          error: "Purchase or verified payment not found. Download is not allowed.",
        },
        { status: 403 }
      );
    }

    // 4. Generate a temporary download link
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(rows[0].file_path, 60);

    if (error || !data?.signedUrl) {
      throw new Error(error?.message || "Could not create download link.");
    }

    return NextResponse.json({
      message: "Download link created successfully.",
      file_name: rows[0].file_name,
      download_url: data.signedUrl,
      expires_in: 60,
    });
  } catch (error) {
    console.error("Secure download error:", error);

    return NextResponse.json(
      { error: "Download could not be completed." },
      { status: 500 }
    );
  }
}