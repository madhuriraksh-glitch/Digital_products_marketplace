import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import path from "path";

import pool from "@/app/lib/db";
import { verifySessionToken } from "@/app/lib/auth";
import supabaseAdmin from "@/app/lib/supabaseAdmin";

export const runtime = "nodejs";

const BUCKET_NAME = "digital-products";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
];

export async function POST(request: NextRequest) {
  let uploadedFilePath: string | null = null;

  try {
    // 1. Verify creator login
    const cookieStore = await cookies();
    const token = cookieStore.get("master_market_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const user = await verifySessionToken(token);

    if (!user || user.role !== "creator") {
      return NextResponse.json(
        { error: "Only creators can upload product files." },
        { status: 403 }
      );
    }

    // 2. Read uploaded form data
    const formData = await request.formData();

    const file = formData.get("file");
    const productId = Number(formData.get("product_id"));

    if (!(file instanceof File) || !Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { error: "A valid file and product ID are required." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be between 1 byte and 50 MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF, JPG, PNG, WEBP and MP4 files are allowed." },
        { status: 400 }
      );
    }

    // 3. Confirm that this product belongs to the logged-in creator
    const [products]: any = await pool.execute(
      `SELECT product_id
       FROM products
       WHERE product_id = ? AND creator_id = ?`,
      [productId, user.user_id]
    );

    if (!products.length) {
      return NextResponse.json(
        { error: "Product not found or you do not own this product." },
        { status: 404 }
      );
    }

    // 4. Create a safe unique storage path
    const extension = path.extname(file.name).toLowerCase();
    const safeFileName = `${randomUUID()}${extension}`;
    uploadedFilePath = `${user.user_id}/${productId}/${safeFileName}`;

    // 5. Upload file to private Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(uploadedFilePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // 6. Save file details in MySQL
    const [result]: any = await pool.execute(
      `INSERT INTO product_files
       (product_id, uploaded_by, file_name, file_path, file_type, file_size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productId,
        user.user_id,
        file.name,
        uploadedFilePath,
        file.type,
        file.size,
      ]
    );

    return NextResponse.json(
      {
        message: "File uploaded successfully.",
        file_id: result.insertId,
        file_name: file.name,
        file_path: uploadedFilePath,
      },
      { status: 201 }
    );
  } catch (error) {
    // Remove the storage object if the MySQL insert failed
    if (uploadedFilePath) {
      await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([uploadedFilePath])
        .catch(() => {});
    }

    console.error("Creator file upload error:", error);

    return NextResponse.json(
      { error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }
}