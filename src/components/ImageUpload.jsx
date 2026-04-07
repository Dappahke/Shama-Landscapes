"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "Upload Image",
  className = "" 
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Set preview when value changes (for edit mode)
  useEffect(() => {
    if (value && typeof value === 'string' && value.startsWith('http')) {
      setPreview(value);
    } else if (!value) {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Update parent with URL and set preview to uploaded URL
      onChange(result.url);
      setPreview(result.url);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      setPreview(null);
      onChange('');
    } finally {
      setUploading(false);
      // Clean up object URL
      if (objectUrl && objectUrl.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  // Check if preview is a valid URL
  const isValidUrl = (url) => {
    if (!url) return false;
    if (typeof url !== 'string') return false;
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    if (url.startsWith('/')) return true; // Local path
    return false;
  };

  return (
    <div className={className}>
      <label className="block mb-2 text-sm font-semibold text-black">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview && isValidUrl(preview) ? (
        <div className="relative overflow-hidden border rounded-xl border-black/10">
          <div className="relative w-full aspect-video">
            {/* Use regular img tag for blob URLs, Next/Image for external URLs */}
            {preview.startsWith('blob:') ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute p-2 transition-colors rounded-lg shadow-lg top-2 right-2 bg-white/90 hover:bg-white"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={triggerUpload}
          disabled={uploading}
          className="w-full transition-all border-2 border-dashed rounded-xl aspect-video bg-shama-clay hover:border-shama-green hover:bg-shama-green/5 flex flex-col items-center justify-center gap-3 disabled:opacity-50 border-black/20"
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-shama-green animate-spin" />
              <span className="text-sm text-black/60">Uploading...</span>
            </>
          ) : (
            <>
              <div className="p-3 bg-white rounded-full shadow-sm">
                <Upload size={24} className="text-shama-green" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-black">Click to upload</p>
                <p className="text-xs text-black/50">JPEG, PNG, WebP up to 5MB</p>
              </div>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="flex items-center gap-1 mt-2 text-sm text-red-500">
          <X size={14} /> {error}
        </p>
      )}
    </div>
  );
}