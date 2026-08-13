import React, { useEffect, useRef, useState } from 'react';
import { Share2, ZoomIn } from 'lucide-react';

export default function CanvasRenderer({
  formatMode,
  userImage,
  formData,
  photoState,
  setPhotoState,
  onOpenShareModal
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (formatMode === 'PFP') {
      renderPFPFrame(ctx, canvas, userImage, formData, photoState);
    } else {
      renderIDCard(ctx, canvas, userImage, formData, photoState);
    }
  }, [formatMode, userImage, formData, photoState]);

  // Handle direct drag on canvas to adjust photo position
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setDragStart({ x: e.clientX, y: e.clientY });
    setPhotoState(prev => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy
    }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch drag handlers for mobile devices
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setPhotoState(prev => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Canvas Display Box */}
      <div className="w-full flex flex-col items-center">
        <div className="relative surface-card p-3.5 rounded-xl border border-[#E5E0D8] w-full max-w-[460px] bg-[#FFFFFF]">
          <canvas
            ref={canvasRef}
            width={1080}
            height={formatMode === 'PFP' ? 1080 : 1350}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="w-full h-auto rounded-lg cursor-grab active:cursor-grabbing object-contain touch-none select-none border border-[#E5E0D8]"
          />

          {/* Interactive Drag Hint */}
          <div className="mt-2.5 text-center text-[11px] font-mono text-[#6B7280] flex items-center justify-center gap-1.5 font-medium">
            <ZoomIn className="w-3.5 h-3.5 text-[#059669]" />
            <span>Drag directly on image to reposition</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="w-full max-w-[460px]">
        <button
          onClick={onOpenShareModal}
          className="w-full py-4 px-6 rounded-lg bg-[#111827] hover:bg-[#000000] text-[#F4F0E7] font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all font-heading tracking-wider uppercase shadow-md"
        >
          <Share2 className="w-4 h-4 fill-current text-[#059669]" />
          <span>EXPORT PNG & SHARE ON X</span>
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   FORMAT A: PFP FRAME RENDERER (1080 x 1080 px) - SOLID COLORS ONLY
   ========================================================================= */
function renderPFPFrame(ctx, canvas, img, formData, photoState) {
  const W = canvas.width;
  const H = canvas.height;

  // 1. Solid Background
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, W, H);

  // Outer border box
  ctx.strokeStyle = '#E5E0D8';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, W - 12, H - 12);

  // 2. Render User Photo clipped inside circle
  const cx = W / 2;
  const cy = H / 2;
  const frameRadius = 430;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, frameRadius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#E5E0D8';
  ctx.fill();

  if (img) {
    drawTransformedPhoto(ctx, img, cx, cy, photoState);
  } else {
    drawPlaceholderText(ctx, cx, cy, "UPLOAD YOUR PHOTO");
  }

  ctx.restore();

  // 3. Solid Accent Ring
  const accentColor = getThemePrimaryColor(formData.themeStyle);

  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(cx, cy, frameRadius + 12, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, frameRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 4. Bottom Event Banner (Solid rectangular pill)
  ctx.save();
  const pillW = 720;
  const pillH = 86;
  const pillX = (W - pillW) / 2;
  const pillY = H - 145;

  ctx.fillStyle = '#111827';
  ctx.beginPath();
  roundRect(ctx, pillX, pillY, pillW, pillH, 12);
  ctx.fill();

  ctx.fillStyle = '#F4F0E7';
  ctx.font = '800 36px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER HOUSE GOA 2026', cx, pillY + pillH / 2);
  ctx.restore();

  // 5. Top Location Badge
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E5E0D8';
  ctx.lineWidth = 2;
  const topBadgeW = 340;
  const topBadgeH = 46;
  const topBadgeX = (W - topBadgeW) / 2;
  const topBadgeY = 40;

  ctx.beginPath();
  roundRect(ctx, topBadgeX, topBadgeY, topBadgeW, topBadgeH, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#059669';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GOA, INDIA · FEB 2026', cx, topBadgeY + topBadgeH / 2);
  ctx.restore();

  // 6. Role Badge Sticker
  if (formData.badgeRole) {
    drawSolidBadgeSticker(ctx, W - 200, H - 220, getBadgeLabel(formData.badgeRole), getBadgeColor(formData.badgeRole));
  }

  // 7. Twitter Handle
  if (formData.twitterHandle && formData.twitterHandle !== '@') {
    ctx.save();
    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6B7280';
    ctx.textAlign = 'center';
    ctx.fillText(formData.twitterHandle, cx, pillY + pillH + 32);
    ctx.restore();
  }
}

/* =========================================================================
   FORMAT B: COLLECTIBLE EVENT CREDENTIAL BADGE (1080 x 1350 px)
   ========================================================================= */
function renderIDCard(ctx, canvas, img, formData, photoState) {
  const W = canvas.width;
  const H = canvas.height;

  // Outer Canvas Base (Solid Ivory)
  ctx.fillStyle = '#F4F0E7';
  ctx.fillRect(0, 0, W, H);

  // Card Outer Margins & Surface
  const cardX = 45;
  const cardY = 45;
  const cardW = W - 90;
  const cardH = H - 90;
  const cardRadius = 16;

  // Determine color scheme
  const theme = getCardThemeDetails(formData.themeStyle);

  // Card Main Body Fill
  ctx.save();
  ctx.fillStyle = theme.bgColor;
  ctx.beginPath();
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();

  // Solid Border Stroke
  ctx.strokeStyle = '#E5E0D8';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Top Accent Solid Line
  ctx.fillStyle = theme.accentColor;
  ctx.fillRect(cardX, cardY, cardW, 10);

  // HEADER: Event Masthead
  const headerY = cardY + 55;
  ctx.save();
  ctx.textAlign = 'center';

  ctx.fillStyle = theme.textColor;
  ctx.font = '800 38px "Space Grotesk", sans-serif';
  ctx.fillText('HH GOA 2026', W / 2, headerY + 24);

  ctx.fillStyle = theme.accentColor;
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.fillText('GOA, INDIA · FEB 2026', W / 2, headerY + 56);
  ctx.restore();

  // HERO PHOTO CONTAINER (Occupying ~40-45% of Card - 520x520 px)
  const photoSize = 520;
  const photoX = (W - photoSize) / 2;
  const photoY = headerY + 85;

  ctx.save();
  // Clip photo to rounded square (14px radius)
  ctx.beginPath();
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 14);
  ctx.clip();

  ctx.fillStyle = '#FAF7F2';
  ctx.fill();

  if (img) {
    drawTransformedPhoto(ctx, img, photoX + photoSize / 2, photoY + photoSize / 2, photoState);
  } else {
    drawPlaceholderText(ctx, photoX + photoSize / 2, photoY + photoSize / 2, "BUILDER PHOTO");
  }
  ctx.restore();

  // Photo Frame Solid Border
  ctx.save();
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  roundRect(ctx, photoX, photoY, photoSize, photoSize, 14);
  ctx.stroke();
  ctx.restore();

  // DETAILS SECTION BELOW PHOTO
  const detailsY = photoY + photoSize + 40;

  // 1. Role Badge (BUILDER / HACKER / SPEAKER)
  const badgeText = getBadgeLabel(formData.badgeRole || 'BUILDER');
  const badgeColor = getBadgeColor(formData.badgeRole || 'BUILDER');
  drawSolidBadgeSticker(ctx, W / 2, detailsY, badgeText, badgeColor);

  // 2. OVERSIZED BUILDER NAME (64px Space Grotesk Bold - Readable on X!)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.textColor;
  ctx.font = '800 60px "Space Grotesk", sans-serif';
  const nameText = (formData.name || 'Elfrida Anisha').toUpperCase();
  ctx.fillText(nameText, W / 2, detailsY + 68);

  // 3. Twitter / X Handle
  ctx.fillStyle = theme.accentColor;
  ctx.font = '700 26px "JetBrains Mono", monospace';
  ctx.fillText(formData.twitterHandle || '@elfrida_dev', W / 2, detailsY + 106);

  // 4. Primary Stack / Role
  if (formData.stackRole) {
    const stackY = detailsY + 132;
    ctx.font = '700 17px "JetBrains Mono", monospace';
    const textWidth = ctx.measureText(formData.stackRole).width;
    const pillPadding = 28;

    ctx.fillStyle = theme.bgColor === '#111827' ? '#1F2937' : '#FAF7F2';
    ctx.strokeStyle = '#E5E0D8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, W/2 - (textWidth + pillPadding)/2, stackY, textWidth + pillPadding, 34, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.textColor;
    ctx.textBaseline = 'middle';
    ctx.fillText(formData.stackRole, W / 2, stackY + 17);
  }

  // 5. PROMINENT BUILDER TITLE (40px Space Grotesk Bold)
  if (formData.builderTitle) {
    ctx.fillStyle = theme.accentColor;
    ctx.font = '800 38px "Space Grotesk", sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`"${formData.builderTitle}"`, W / 2, detailsY + 215);
  }
  ctx.restore();

  // CARD FOOTER
  const footerY = cardY + cardH - 95;

  // Solid Divider line
  ctx.strokeStyle = '#E5E0D8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 40, footerY);
  ctx.lineTo(cardX + cardW - 40, footerY);
  ctx.stroke();

  // Solid Barcode
  drawSolidBarcode(ctx, cardX + 45, footerY + 18, 280, 42);

  // Metadata & Hashtag
  ctx.save();
  ctx.textAlign = 'right';
  ctx.fillStyle = '#6B7280';
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('PASS ID: #HHG26-8942', cardX + cardW - 45, footerY + 34);

  ctx.fillStyle = theme.textColor;
  ctx.font = '800 20px "JetBrains Mono", monospace';
  ctx.fillText('#FrameInGoa', cardX + cardW - 45, footerY + 62);
  ctx.restore();
}

/* =========================================================================
   HELPER DRAWING FUNCTIONS
   ========================================================================= */

function drawTransformedPhoto(ctx, img, cx, cy, photoState) {
  ctx.save();
  ctx.translate(cx + photoState.offsetX, cy + photoState.offsetY);
  ctx.rotate((photoState.rotate * Math.PI) / 180);
  ctx.scale(photoState.scale, photoState.scale);

  ctx.filter = `brightness(${photoState.brightness}%) contrast(${photoState.contrast}%)`;

  const aspect = img.width / img.height;
  let drawW = 750;
  let drawH = 750 / aspect;
  if (aspect < 1) {
    drawH = 750;
    drawW = 750 * aspect;
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

function drawSolidBadgeSticker(ctx, x, y, text, color) {
  ctx.save();
  ctx.font = '800 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const w = metrics.width + 32;
  const h = 34;

  ctx.fillStyle = color;
  ctx.beginPath();
  roundRect(ctx, x - w / 2, y - h / 2, w, h, 6);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawPlaceholderText(ctx, cx, cy, text) {
  ctx.save();
  ctx.fillStyle = '#6B7280';
  ctx.font = '700 22px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

function drawSolidBarcode(ctx, x, y, width, height) {
  ctx.save();
  ctx.fillStyle = '#111827';
  let currX = x;
  const barWidths = [2, 4, 1, 3, 5, 2, 1, 4, 2, 6, 1, 3, 2, 5, 1, 4, 3, 2];
  let idx = 0;

  while (currX < x + width) {
    const bw = barWidths[idx % barWidths.length];
    if (idx % 2 === 0) {
      ctx.fillRect(currX, y, bw, height);
    }
    currX += bw + (idx % 3 === 0 ? 3 : 1);
    idx++;
  }
  ctx.restore();
}

function getThemePrimaryColor(themeId) {
  switch (themeId) {
    case 'terracotta_sunset': return '#EA580C';
    case 'warm_gold': return '#D97706';
    case 'monochrome_navy': return '#111827';
    default: return '#059669';
  }
}

function getCardThemeDetails(themeId) {
  switch (themeId) {
    case 'sunset_terracotta':
      return { bgColor: '#FFFBF5', accentColor: '#EA580C', textColor: '#111827' };
    case 'gold_vip':
      return { bgColor: '#FFFFFA', accentColor: '#D97706', textColor: '#111827' };
    case 'navy_edition':
      return { bgColor: '#111827', accentColor: '#059669', textColor: '#F4F0E7' };
    default:
      return { bgColor: '#FFFFFF', accentColor: '#059669', textColor: '#111827' };
  }
}

function getBadgeLabel(roleId) {
  switch (roleId) {
    case 'HACKER': return 'HACKER';
    case 'SPEAKER': return 'SPEAKER';
    case 'VIP': return 'VIP PASS';
    case 'ATTENDEE': return 'GOA BOUND';
    default: return 'BUILDER';
  }
}

function getBadgeColor(roleId) {
  switch (roleId) {
    case 'HACKER': return '#EA580C';
    case 'SPEAKER': return '#D97706';
    case 'VIP': return '#111827';
    case 'ATTENDEE': return '#7C3AED';
    default: return '#059669';
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}
