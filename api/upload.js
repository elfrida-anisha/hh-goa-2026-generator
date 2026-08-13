import https from 'https';

// In-memory store for serverless instance & URL payload fallback
const SHARE_CACHE = global.SHARE_CACHE || new Map();
global.SHARE_CACHE = SHARE_CACHE;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image, name, title, stackRole, twitterHandle, formatMode } = req.body || {};

    if (!image) {
      return res.status(400).json({ error: 'Missing image payload' });
    }

    // Clean base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Upload image to public CDN (ImgBB free API)
    const imgbbApiKey = '6d207e02198a847aa98d0a2a901485a5';
    let imageUrl = '';

    try {
      const postData = new URLSearchParams();
      postData.append('image', base64Data);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData.toString()
      });

      const json = await response.json();
      if (json && json.data && json.data.display_url) {
        imageUrl = json.data.display_url;
      }
    } catch (err) {
      console.error('ImgBB upload error:', err);
    }

    // Backup Imgur upload if ImgBB fails
    if (!imageUrl) {
      try {
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            'Authorization': 'Client-ID 546c25a59c58ad7',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: base64Data,
            type: 'base64'
          })
        });
        const json = await response.json();
        if (json && json.data && json.data.link) {
          imageUrl = json.data.link;
        }
      } catch (err) {
        console.error('Imgur upload error:', err);
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to upload image to public CDN' });
    }

    // Generate unique ID
    const uniqueId = 'pass_' + Math.random().toString(36).substring(2, 9);
    
    // Encode image URL in ID payload as safe url-safe string
    const encodedPayload = Buffer.from(JSON.stringify({
      u: imageUrl,
      n: name || 'Builder',
      t: title || 'Product Hacker',
      s: stackRole || 'Web3',
      h: twitterHandle || '@builder'
    })).toString('base64url');

    const shareId = `${uniqueId}_${encodedPayload}`;

    const host = req.headers.host || 'hh-goa-2026-generator-three.vercel.app';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const shareUrl = `${protocol}://${host}/share/${shareId}`;

    return res.status(200).json({
      success: true,
      id: shareId,
      imageUrl,
      shareUrl
    });

  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
