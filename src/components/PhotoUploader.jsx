import React, { useState, useRef } from 'react';
import { Upload, Loader2, RefreshCw } from 'lucide-react';
import { SAMPLE_AVATAR } from '../constants/presetTitles';

export default function PhotoUploader({ onImageLoaded, currentImage, onResetImage }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setErrorMsg('');

    try {
      let imageFile = file;

      // Handle HEIC/HEIF files from iPhones
      const isHeic = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type.includes('heic');
      if (isHeic) {
        try {
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9
          });
          const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          imageFile = new File([blobToUse], 'photo.jpg', { type: 'image/jpeg' });
        } catch (err) {
          console.error("HEIC conversion failed:", err);
          setErrorMsg("Could not convert HEIC image. Please try a JPG or PNG file.");
          setLoading(false);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          onImageLoaded(img);
          setLoading(false);
        };
        img.onerror = () => {
          setErrorMsg("Failed to load image file.");
          setLoading(false);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageFile);

    } catch (err) {
      console.error(err);
      setErrorMsg("Error reading image file.");
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSamplePhoto = () => {
    setLoading(true);
    setErrorMsg('');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      onImageLoaded(img);
      setLoading(false);
    };
    img.onerror = () => {
      setErrorMsg("Failed to load sample photo.");
      setLoading(false);
    };
    img.src = SAMPLE_AVATAR;
  };

  return (
    <div className="w-full space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
        className="hidden"
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-lg p-6 border text-center transition-all ${
          isDragging
            ? 'border-[#059669] bg-[#059669]/5 scale-[1.01]'
            : 'border-[#E5E0D8] bg-[#FAF7F2] hover:bg-[#FFFFFF] hover:border-[#111827]'
        }`}
      >
        {loading ? (
          <div className="py-4 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 text-[#059669] animate-spin" />
            <p className="text-xs font-semibold text-[#111827]">Processing Photo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="w-5 h-5 text-[#059669]" />
            <div>
              <p className="text-sm font-bold text-[#111827] font-heading tracking-wide uppercase">
                UPLOAD PHOTO
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
                Portrait, landscape or anything in between.
              </p>
              <p className="text-[11px] font-mono text-[#6B7280]/70 mt-1">
                JPG · PNG · HEIC
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Links */}
      <div className="flex items-center justify-between text-xs px-0.5">
        <button
          type="button"
          onClick={handleSamplePhoto}
          className="text-[#059669] hover:underline font-bold font-mono"
        >
          + Use Sample Photo
        </button>

        {currentImage && (
          <button
            type="button"
            onClick={onResetImage}
            className="text-[#6B7280] hover:text-[#111827] flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Photo Position
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-xs text-red-600 font-medium">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
