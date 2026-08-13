import React, { useState } from 'react';
import { X, Download, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ShareModal({
  isOpen,
  onClose,
  formatMode,
  formData
}) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#059669', '#EA580C', '#D97706', '#111827']
    });
  };

  // High-Resolution Image Direct Export
  const handleDownload = () => {
    triggerConfetti();
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    const filename = formatMode === 'PFP'
      ? `HH-Goa-2026-PFP-${formData.name || 'Builder'}.png`
      : `HH-Goa-2026-BuilderID-${formData.name || 'Builder'}.png`;

    link.download = filename.replace(/\s+/g, '_');
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  // Upload image to public CDN & open X with dynamic Open Graph card preview
  const handleShareToX = async () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    setIsSharing(true);
    triggerConfetti();

    try {
      const imageDataUrl = canvas.toDataURL('image/png', 1.0);

      // Call serverless endpoint to upload image and generate share URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageDataUrl,
          name: formData.name,
          title: formData.builderTitle,
          stackRole: formData.stackRole,
          twitterHandle: formData.twitterHandle,
          formatMode
        })
      });

      const data = await response.json();

      let targetShareUrl = 'https://hh-goa-2026-generator-three.vercel.app/';
      if (data && data.shareUrl) {
        targetShareUrl = data.shareUrl;
        setShareUrl(data.shareUrl);
      }

      const tweetCaption = `Building, shipping and making things in Goa. See you at HH Goa 2026. 🌴 #FrameInGoa`;
      const tweetIntentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetCaption)}&url=${encodeURIComponent(targetShareUrl)}`;

      window.open(tweetIntentUrl, '_blank', 'noopener,noreferrer');

    } catch (err) {
      console.error('Share to X error:', err);
      // Fallback tweet intent
      const fallbackCaption = `Building, shipping and making things in Goa. See you at HH Goa 2026. 🌴 #FrameInGoa https://hh-goa-2026-generator-three.vercel.app/`;
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(fallbackCaption)}`, '_blank', 'noopener,noreferrer');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyImage = async () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch (err) {
      console.error("Clipboard copy error:", err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#FFFFFF] p-6 sm:p-8 rounded-xl border border-[#E5E0D8] space-y-6 shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md bg-[#FAF7F2] hover:bg-[#E5E0D8] text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-[#059669] tracking-wider uppercase">
            EVENT CREDENTIAL READY
          </span>
          <h2 className="text-2xl font-bold text-[#111827] font-heading">
            Share Your HH Goa 2026 Badge
          </h2>
          <p className="text-xs text-[#6B7280]">
            Download high-res 1080×1350 PNG or post on X with dynamic preview card & <span className="text-[#059669] font-mono font-bold">#FrameInGoa</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          
          {/* Share on X Primary Button */}
          <button
            onClick={handleShareToX}
            disabled={isSharing}
            className="w-full py-4 px-5 rounded-md bg-[#111827] hover:bg-[#000000] text-[#F4F0E7] font-extrabold text-sm flex items-center justify-center gap-2.5 transition-colors font-heading tracking-wider uppercase shadow-md disabled:opacity-75"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-4 h-4 text-[#059669] animate-spin" />
                <span>UPLOADING IMAGE & PREPARING X CARD...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current text-[#059669]" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>POST TO X WITH #FrameInGoa</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-70" />
              </>
            )}
          </button>

          {/* Direct Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-5 rounded-md bg-[#FAF7F2] hover:bg-[#F4F0E7] text-[#111827] font-bold text-xs flex items-center justify-center gap-2 border border-[#E5E0D8] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#059669]" />
            <span>DOWNLOAD HIGH-RES PNG (1080×1350)</span>
          </button>

          {/* Copy Image Button */}
          <button
            onClick={handleCopyImage}
            className="w-full py-2.5 px-5 rounded-md bg-transparent hover:bg-[#FAF7F2] text-[#6B7280] hover:text-[#111827] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span className="text-[#059669] font-bold">Copied Image to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image to Clipboard</span>
              </>
            )}
          </button>

        </div>

        {/* Pre-filled Tweet Preview Box */}
        <div className="p-4 rounded-md bg-[#FAF7F2] border border-[#E5E0D8] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280]">
            <span>TWEET & OPEN GRAPH CARD PREVIEW</span>
            <span className="text-[#059669]">#FrameInGoa</span>
          </div>
          <p className="text-xs text-[#111827] font-medium leading-relaxed">
            Building, shipping and making things in Goa. See you at HH Goa 2026. 🌴 #FrameInGoa
          </p>
          {shareUrl && (
            <p className="text-[11px] font-mono text-[#059669] truncate">
              {shareUrl}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
