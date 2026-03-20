"use client";

import { useState } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

export default function GalleryUpload({ 
  images = [], 
  onChange,
  label = "Image Gallery"
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate all files
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}: Invalid file type`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name}: File too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'gallery');

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Failed to upload ${file.name}`);
        }

        uploadedUrls.push(result.url);
        setUploadProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      // Add to existing images
      onChange([...images, ...uploadedUrls]);

    } catch (err) {
      console.error('Upload error:', err);
      alert(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  // Check if URL is valid
  const isValidUrl = (url) => {
    if (!url) return false;
    if (typeof url !== 'string') return false;
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    if (url.startsWith('/')) return true;
    return false;
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-black">
        {label}
      </label>

      {/* Upload Button */}
      <div className="mb-4">
        <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
          uploading 
            ? 'border-[#0F7F40] bg-[#0F7F40]/5' 
            : 'border-black/20 hover:border-[#0F7F40] hover:bg-[#F5EBE8]'
        }`}>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFilesSelect}
            disabled={uploading}
            className="hidden"
          />
          
          {uploading ? (
            <>
              <Loader2 size={20} className="text-[#0F7F40] animate-spin" />
              <span className="text-sm font-medium text-[#0F7F40]">
                Uploading... {uploadProgress}%
              </span>
            </>
          ) : (
            <>
              <Upload size={20} className="text-black/60" />
              <span className="text-sm font-medium text-black/60">
                Click to upload multiple images
              </span>
            </>
          )}
        </label>
        <p className="mt-1 text-xs text-black/40">
          JPEG, PNG, WebP up to 5MB each
        </p>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {images.map((url, index) => {
            // Skip invalid URLs
            if (!isValidUrl(url)) return null;
            
            return (
              <div 
                key={`${url}-${index}`}
                className="relative overflow-hidden border group aspect-square rounded-xl border-black/10"
              >
                {/* Use regular img tag instead of Next.js Image */}
                <img
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 transition-all bg-black/0 group-hover:bg-black/40">
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute p-1.5 transition-opacity bg-white/90 rounded-lg shadow-lg opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-100"
                  >
                    <X size={14} className="text-red-600" />
                  </button>

                  {/* Reorder buttons */}
                  <div className="absolute flex gap-1 transition-opacity -translate-x-1/2 opacity-0 bottom-2 left-1/2 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-white disabled:opacity-30"
                    >
                      <span className="text-xs">←</span>
                    </button>
                    <span className="px-2 py-1.5 bg-white/90 rounded-lg text-xs font-medium">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === images.length - 1}
                      className="p-1.5 bg-white/90 rounded-lg hover:bg-white disabled:opacity-30"
                    >
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}