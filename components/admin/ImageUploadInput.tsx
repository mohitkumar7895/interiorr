"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { toast } from "sonner";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = "Image",
  placeholder = "https://... or /uploads/image.jpg",
  required = false,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WebP, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Text Input for manual URL or uploaded path */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="w-full bg-brand-surface border border-brand-gold/30 rounded-xl px-4 py-2.5 text-sm text-brand-cream placeholder-gray-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              title="Clear"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-gold/15 text-brand-gold border border-brand-gold/40 hover:bg-brand-gold hover:text-brand-black transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>Upload File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Box */}
      {value && (
        <div className="relative w-full max-w-[200px] h-28 rounded-xl overflow-hidden border border-brand-gold/30 bg-brand-black/50 group">
          <SafeImage
            src={value}
            alt="Preview"
            fill
            sizes="200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider bg-brand-black/80 px-2 py-1 rounded">
              Current Image
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

