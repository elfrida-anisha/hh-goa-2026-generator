export default function handler(req, res) {
  const { id } = req.query || {};

  let imageUrl = 'https://hh-goa-2026-generator-three.vercel.app/hero.png';
  let name = 'Builder';
  let title = 'Product Hacker';
  let handle = '@builder';

  if (id && typeof id === 'string' && id.includes('_')) {
    try {
      const parts = id.split('_');
      const payloadStr = parts[parts.length - 1];
      const decodedJson = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
      if (decodedJson.u) imageUrl = decodedJson.u;
      if (decodedJson.n) name = decodedJson.n;
      if (decodedJson.t) title = decodedJson.t;
      if (decodedJson.h) handle = decodedJson.h;
    } catch (e) {
      console.error('Failed to parse share payload:', e);
    }
  }

  const pageTitle = `HH Goa 2026 Builder Pass — ${name}`;
  const shareDescription = `Building, shipping and making things in Goa. See you at HH Goa 2026. 🌴 #FrameInGoa`;
  const canonicalUrl = `https://hh-goa-2026-generator-three.vercel.app/share/${id || ''}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(shareDescription)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(shareDescription)}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1080">
  <meta property="og:image:height" content="1350">
  <meta property="og:site_name" content="Hacker House Goa 2026">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@HHGoa2026">
  <meta name="twitter:creator" content="${escapeHtml(handle)}">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(shareDescription)}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #F4F0E7;
      color: #111827;
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .header-masthead {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
      text-transform: uppercase;
    }
    .header-masthead span { color: #059669; }
    .card-container {
      background: #FFFFFF;
      border: 1px solid #E5E0D8;
      border-radius: 16px;
      padding: 20px;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 10px 25px rgba(17, 24, 39, 0.06);
      text-align: center;
    }
    .graphic-preview {
      width: 100%;
      height: auto;
      border-radius: 12px;
      border: 1px solid #E5E0D8;
      display: block;
      margin-bottom: 20px;
    }
    .meta-box {
      border-top: 1px solid #E5E0D8;
      padding-top: 16px;
      margin-bottom: 20px;
      text-align: left;
    }
    .name-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }
    .role-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #059669;
      margin-top: 4px;
      font-weight: 700;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 20px;
      border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      transition: background 0.15s ease;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #111827;
      color: #F4F0E7;
    }
    .btn-primary:hover { background-color: #000000; }
    .btn-secondary {
      background-color: #FAF7F2;
      color: #111827;
      border: 1px solid #E5E0D8;
    }
    .btn-secondary:hover { background-color: #E5E0D8; }
    .footer-text {
      margin-top: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #6B7280;
    }
  </style>
</head>
<body>

  <div class="header-masthead">
    HH GOA <span>2026</span>
  </div>

  <div class="card-container">
    <img src="${imageUrl}" alt="${escapeHtml(pageTitle)}" class="graphic-preview" />

    <div class="meta-box">
      <div class="name-title">${escapeHtml(name)}</div>
      <div class="role-title font-mono">${escapeHtml(handle)} • "${escapeHtml(title)}"</div>
    </div>

    <div class="btn-group">
      <a href="${imageUrl}" download="HH-Goa-2026-Pass.png" target="_blank" class="btn btn-primary">
        ⬇ DOWNLOAD HIGH-RES PNG (1080×1350)
      </a>

      <a href="https://x.com/intent/tweet?text=${encodeURIComponent(shareDescription)}&url=${encodeURIComponent(canonicalUrl)}" target="_blank" class="btn btn-secondary">
        <svg style="width:16px;height:16px;fill:currentColor;" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        POST TO X WITH #FrameInGoa
      </a>

      <a href="https://hh-goa-2026-generator-three.vercel.app/" class="btn btn-secondary">
        ✨ CREATE YOUR OWN BUILDER ID
      </a>
    </div>
  </div>

  <div class="footer-text">
    HACKER HOUSE GOA 2026 • #FrameInGoa
  </div>

</body>
</html>`;

  res.send(html);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
