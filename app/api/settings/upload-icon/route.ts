import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_SVG = 100 * 1024;
const MAX_SIZE_RASTER = 500 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const key = formData.get("key") as string | null;

    if (!file || !key) {
      return NextResponse.json({ success: false, error: "الملف والمفتاح مطلوبان" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: "نوع الملف غير مدعوم. الأنواع المدعومة: SVG, PNG, JPG, WEBP" }, { status: 400 });
    }

    const isSvg = file.type === "image/svg+xml";
    const maxSize = isSvg ? MAX_SIZE_SVG : MAX_SIZE_RASTER;

    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: `حجم الملف كبير جدًا. الحد الأقصى: ${isSvg ? "100KB" : "500KB"}` }, { status: 400 });
    }

    const ext = isSvg ? "svg" : file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
    const filename = `${key}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "social");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const iconUrl = `/uploads/social/${filename}?v=${Date.now()}`;
    return NextResponse.json({ success: true, iconUrl });
  } catch (error) {
    console.error("Icon upload error:", error);
    return NextResponse.json({ success: false, error: "فشل رفع الملف" }, { status: 500 });
  }
}