import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "image/webp", "image/x-icon"];
const MAX_SIZE = 500 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "الملف مطلوب" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, error: "نوع الملف غير مدعوم. الأنواع المدعومة: SVG, PNG, JPG, WEBP, ICO" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "حجم الملف كبير جدًا (الحد الأقصى 500KB)" }, { status: 400 });
    }

    const ext =
      file.type === "image/svg+xml" ? "svg" :
      file.type === "image/png" ? "png" :
      file.type === "image/jpeg" ? "jpg" :
      file.type === "image/webp" ? "webp" :
      "ico";

    const uploadDir = join(process.cwd(), "public", "uploads", "favicon");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, `favicon.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    const faviconUrl = `/uploads/favicon/favicon.${ext}?v=${Date.now()}`;
    return NextResponse.json({ success: true, faviconUrl });
  } catch (error) {
    console.error("Favicon upload error:", error);
    return NextResponse.json({ success: false, error: "فشل رفع الملف" }, { status: 500 });
  }
}
