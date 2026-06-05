import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_SVG = 100 * 1024;
const MAX_SIZE_RASTER = 500 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "الملف مطلوب" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "نوع الملف غير مدعوم. الأنواع المدعومة: SVG, PNG, JPG, WEBP" },
        { status: 400 }
      );
    }

    const isSvg = file.type === "image/svg+xml";
    const maxSize = isSvg ? MAX_SIZE_SVG : MAX_SIZE_RASTER;

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `حجم الملف كبير جدًا. الحد الأقصى: ${isSvg ? "100KB" : "500KB"}` },
        { status: 400 }
      );
    }

    const ext = isSvg ? "svg" : file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", "bento");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const iconUrl = `/uploads/bento/${filename}?v=${Date.now()}`;
    return NextResponse.json({ success: true, iconUrl });
  } catch (error) {
    console.error("Bento icon upload error:", error);
    return NextResponse.json({ success: false, error: "فشل رفع الملف" }, { status: 500 });
  }
}
