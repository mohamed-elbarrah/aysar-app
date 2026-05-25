# AppSection Image Customization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow admin to upload custom left/right phone images for AppSection with real-time preview, aspect ratio validation (9:19.5), and fallback to default image.

**Architecture:** Follow existing patterns (Bento icon upload) - local filesystem storage, REST API endpoint, FormData uploads. Add new `app_images` JSON field to `home_page.app_section`. Create reusable image upload component with preview, validation, and crop warning.

**Tech Stack:** Next.js App Router, Supabase, Tailwind CSS, local filesystem storage

---

## File Structure

```
app/
├── api/
│   └── upload-app-image/
│       └── route.ts              # NEW: Upload endpoint
├── (dashboard)/
│   └── dashboard/
│       └── home-page/
│           └── page.tsx          # MODIFY: Add image uploads + preview
├── components/
│   └── ImageUploadWithPreview.tsx # NEW: Reusable upload component
├── lib/
│   ├── dashboard/
│   │   └── placeholders.ts       # MODIFY: Add app_images default
│   └── home-page-data.ts         # MODIFY: Update types + fetch
└── sections/
    └── AppSection.tsx            # MODIFY: Accept appImages prop
```

---

## Task 1: Create Upload API Endpoint

**Files:**
- Create: `app/api/upload-app-image/route.ts`
- Test: Upload via curl/admin UI

**Requirements:**
- Store to `public/uploads/app-section/`
- Max size: 2MB
- Accept: JPG, PNG, WEBP
- Validate aspect ratio 9:19.5 (±5% tolerance)
- Return `{ success: true, imageUrl: string }`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const position = formData.get("position") as "left" | "right" | null;

    if (!file || !position) {
      return NextResponse.json(
        { success: false, error: "Missing file or position" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPG, PNG, WEBP allowed" },
        { status: 400 }
      );
    }

    // Validate size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File too large (max 2MB)" },
        { status: 400 }
      );
    }

    // Create directory
    const uploadDir = join(process.cwd(), "public", "uploads", "app-section");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `phone-${position}-${Date.now()}.${ext}`;
    const filepath = join(uploadDir, filename);

    // Validate aspect ratio
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get image dimensions using sharp or similar
    // For now, we'll validate client-side, server validates file type/size
    // TODO: Add server-side dimension validation

    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/app-section/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

**Testing:**
```bash
curl -X POST -F "file=@/path/to/test.jpg" -F "position=left" http://localhost:3000/api/upload-app-image
```

---

## Task 2: Update Dashboard Placeholders

**Files:**
- Modify: `app/lib/dashboard/placeholders.ts` (around line 113)

Add `app_images` to `APP_SECTION` default:

```typescript
export const APP_SECTION = {
  // ... existing fields
  eyebrow: "تطبيق أيسَر",
  title: "من أول طوبة",
  titleAccent: "لآخر لمسة",
  description: "...",
  appStoreUrl: "...",
  googlePlayUrl: "...",
  // NEW:
  app_images: {
    left_phone: null, // string | null - URL to custom image
    right_phone: null,
  },
};
```

---

## Task 3: Create Reusable ImageUpload Component

**Files:**
- Create: `app/components/ImageUploadWithPreview.tsx`

```typescript
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";

interface ImageUploadWithPreviewProps {
  label: string;
  currentImage: string | null;
  defaultImage: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  aspectRatio?: { width: number; height: number };
}

export function ImageUploadWithPreview({
  label,
  currentImage,
  defaultImage,
  onUpload,
  onRemove,
  aspectRatio = { width: 9, height: 19.5 },
}: ImageUploadWithPreviewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [aspectWarning, setAspectWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = previewUrl || currentImage || defaultImage;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate aspect ratio
    const img = new window.Image();
    img.onload = () => {
      const uploadedRatio = img.width / img.height;
      const expectedRatio = aspectRatio.width / aspectRatio.height;
      const tolerance = 0.05; // 5% tolerance

      if (Math.abs(uploadedRatio - expectedRatio) > tolerance) {
        setAspectWarning(
          `Warning: Image aspect ratio (${img.width}:${img.height}) differs from iPhone format (${aspectRatio.width}:${aspectRatio.height}). Image may be cropped or stretched.`
        );
      } else {
        setAspectWarning(null);
      }
    };
    img.src = URL.createObjectURL(file);

    setIsUploading(true);
    try {
      await onUpload(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-navy">{label}</label>
      
      {/* Preview */}
      <div className="relative w-32 h-64 rounded-2xl overflow-hidden border-2 border-dashed border-[#e8edf5] bg-[#f5f6f9]">
        <Image
          src={displayImage}
          alt={label}
          fill
          className="object-cover"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Aspect Ratio Warning */}
      {aspectWarning && (
        <div className="flex items-start gap-2 text-amber-600 text-xs bg-amber-50 p-2 rounded">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{aspectWarning}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-navy text-white rounded-lg hover:opacity-90 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {previewUrl ? "Change" : "Upload"}
        </button>
        
        {(previewUrl || currentImage) && (
          <button
            onClick={() => {
              onRemove();
              setPreviewUrl(null);
              setAspectWarning(null);
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
```

---

## Task 4: Update AppSectionEditor in Dashboard

**Files:**
- Modify: `app/(dashboard)/dashboard/home-page/page.tsx` (around line 463, AppSectionEditor)

Add to the AppSectionEditor component:

```typescript
// Add to AppSectionEditor props/state
const [leftPhoneImage, setLeftPhoneImage] = useState<string | null>(
  data.app_images?.left_phone || null
);
const [rightPhoneImage, setRightPhoneImage] = useState<string | null>(
  data.app_images?.right_phone || null
);

// Add to dirty check
useEffect(() => {
  const isDirty =
    eyebrow !== initialData.eyebrow ||
    title !== initialData.title ||
    // ... other fields ...
    leftPhoneImage !== initialData.app_images?.left_phone ||
    rightPhoneImage !== initialData.app_images?.right_phone;
  
  if (isDirty) onDirty?.();
}, [eyebrow, title, /* ... */, leftPhoneImage, rightPhoneImage]);

// Upload handlers
const handleLeftPhoneUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("position", "left");

  const res = await fetch("/api/upload-app-image", {
    method: "POST",
    body: formData,
  });
  
  const data = await res.json();
  if (data.success) {
    setLeftPhoneImage(data.imageUrl);
  } else {
    throw new Error(data.error);
  }
};

const handleRightPhoneUpload = async (file: File) => {
  // Same as above but "right" position
};

// In the render, add before the save bar:
<div className="grid grid-cols-2 gap-6 mb-6">
  <ImageUploadWithPreview
    label="Left Phone Image"
    currentImage={leftPhoneImage}
    defaultImage="/app-screenshot.jpg"
    onUpload={handleLeftPhoneUpload}
    onRemove={() => setLeftPhoneImage(null)}
    aspectRatio={{ width: 9, height: 19.5 }}
  />
  <ImageUploadWithPreview
    label="Right Phone Image"
    currentImage={rightPhoneImage}
    defaultImage="/app-screenshot.jpg"
    onUpload={handleRightPhoneUpload}
    onRemove={() => setRightPhoneImage(null)}
    aspectRatio={{ width: 9, height: 19.5 }}
  />
</div>

// Update save handler
const handleSave = async () => {
  await onSave({
    ...data,
    eyebrow,
    title,
    // ... other fields ...
    app_images: {
      left_phone: leftPhoneImage,
      right_phone: rightPhoneImage,
    },
  });
};
```

---

## Task 5: Update Client-Side Types and Data Fetching

**Files:**
- Modify: `app/lib/home-page-data.ts`

Update the AppSection interface:

```typescript
export interface AppSectionData {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  app_images?: {           // NEW
    left_phone?: string | null;
    right_phone?: string | null;
  };
}
```

Update `getHomePageData()` to include app_images:

```typescript
const { data } = await supabase
  .from("home_page")
  .select("*")
  .eq("id", "HOME")
  .single();

return {
  // ... other sections ...
  appSection: {
    ...data.app_section,
    app_images: data.app_section?.app_images || {
      left_phone: null,
      right_phone: null,
    },
  },
};
```

---

## Task 6: Update AppSection Component

**Files:**
- Modify: `app/sections/AppSection.tsx`

Update PhoneFrame to accept custom image:

```typescript
interface PhoneFrameProps {
  className?: string;
  customImage?: string | null;  // NEW
}

function PhoneFrame({ className, customImage }: PhoneFrameProps) {
  const imageSrc = customImage || "/app-screenshot.jpg";
  
  return (
    // ... existing code ...
    <Image
      src={imageSrc}
      alt="تطبيق أيسَر"
      width={300}
      height={600}
      className="w-full h-auto object-cover"
      priority
    />
    // ... rest of component ...
  );
}
```

Update AppSection props:

```typescript
interface AppSectionProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  app_images?: {            // NEW
    left_phone?: string | null;
    right_phone?: string | null;
  };
}
```

Pass custom images to PhoneFrame:

```typescript
// Left phone
<PhoneFrame 
  className="w-[100px] sm:w-[120px] lg:w-[140px]" 
  customImage={app_images?.left_phone}
/>

// Right phone
<PhoneFrame 
  className="w-[100px] sm:w-[120px] lg:w-[140px]" 
  customImage={app_images?.right_phone}
/>
```

---

## Task 7: Update Public Page to Pass Images

**Files:**
- Modify: `app/(public)/page.tsx`

Pass `app_images` to AppSection:

```typescript
<AppSection
  eyebrow={appSection.eyebrow}
  title={appSection.title}
  titleAccent={appSection.titleAccent}
  description={appSection.description}
  appStoreUrl={appSection.appStoreUrl}
  googlePlayUrl={appSection.googlePlayUrl}
  app_images={appSection.app_images}  // NEW
/>
```

---

## Task 8: Create Uploads Directory

**Files:**
- Create: `public/uploads/app-section/.gitkeep`

Add to `.gitignore`:
```
# App section uploads (keep directory, ignore files)
public/uploads/app-section/*
!public/uploads/app-section/.gitkeep
```

---

## Testing Checklist

### Admin Dashboard
- [ ] Navigate to Dashboard → Home Page → App Section
- [ ] Upload left phone image (valid aspect ratio)
- [ ] Upload right phone image (valid aspect ratio)
- [ ] Preview updates immediately after upload
- [ ] Aspect ratio warning appears for wrong dimensions
- [ ] Remove images and see default restored
- [ ] Save changes and see success message

### Public Site
- [ ] View home page with custom images
- [ ] Verify custom images appear in phone frames
- [ ] Test with no custom images (should show default)
- [ ] Test with only one custom image (other shows default)

### API
- [ ] Upload API rejects non-image files
- [ ] Upload API rejects oversized files (>2MB)
- [ ] Upload API returns correct URL

---

## Summary

| Component | Responsibility |
|-----------|---------------|
| `ImageUploadWithPreview` | Reusable upload UI with preview, validation, aspect ratio warning |
| `/api/upload-app-image` | Server-side upload handling, file validation, storage |
| `AppSectionEditor` | Admin dashboard integration, state management |
| `AppSection` | Client-side rendering with custom or default images |
| `getHomePageData` | Database fetching with app_images fallback |

**Key Features:**
1. ✅ Two separate phone images (left/right)
2. ✅ Real-time preview before save
3. ✅ Aspect ratio validation (9:19.5, ±5% tolerance)
4. ✅ Fallback to default image
5. ✅ Follows existing patterns (Bento upload)
6. ✅ Clean UI with upload/remove buttons

**Estimated Time:** 2-3 hours total
