"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";

interface ImageUploadWithPreviewProps {
  label: string;
  currentImage: string | null;
  defaultImage: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
  aspectRatio?: { width: number; height: number };
  containerClassName?: string;
}

export function ImageUploadWithPreview({
  label,
  currentImage,
  defaultImage,
  onUpload,
  onRemove,
  aspectRatio = { width: 9, height: 19.5 },
  containerClassName = "w-32 h-64",
}: ImageUploadWithPreviewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aspectWarning, setAspectWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevCurrentImage = useRef(currentImage);

  useEffect(() => {
    if (
      prevCurrentImage.current !== currentImage &&
      currentImage &&
      previewUrl
    ) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    prevCurrentImage.current = currentImage;
  }, [currentImage, previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Display priority: real URL > temp blob > default fallback
  const displayImage = currentImage || previewUrl || defaultImage;

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
          `تنبيه: نسبة العرض للارتفاع (${img.width}:${img.height}) تختلف عن نسبة iPhone (${aspectRatio.width}:${aspectRatio.height}). قد يتم قص الصورة أو تمددها.`,
        );
      } else {
        setAspectWarning(null);
      }
    };

    const localBlob = URL.createObjectURL(file);
    img.src = localBlob;

    setIsUploading(true);
    try {
      await onUpload(file);
      // On success: parent will update currentImage via onChange -> the
      // effect above will auto-revoke the blob and switch to the real URL.
    } catch (error) {
      console.error("Upload failed:", error);
      // On failure: rollback — clear the blob so the previous image shows again
      URL.revokeObjectURL(localBlob);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setAspectWarning(null);
    onRemove();
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-navy">{label}</label>

      {/* Preview */}
      <div
        className={`relative ${containerClassName} rounded-2xl overflow-hidden border-2 border-dashed border-[#e8ebf3] bg-[#F4F7FA]`}
      >
        <Image
          src={displayImage}
          alt={label}
          fill
          className="object-cover"
          unoptimized={isExternalUrl(displayImage)}
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
          {previewUrl || currentImage ? "تغيير" : "رفع"}
        </button>

        {(previewUrl || currentImage) && (
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <X className="w-4 h-4" />
            إزالة
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

/**
 * Returns true if the URL is an external (non-local) URL.
 * External URLs should use the `unoptimized` prop on Next.js Image
 * to avoid the image optimization pipeline and serve them directly.
 */
function isExternalUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("/")) return false;
  if (url.startsWith("blob:")) return false;
  return true;
}
