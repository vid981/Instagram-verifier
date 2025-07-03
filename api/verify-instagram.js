export default async function handler(req, res) {
  // ✅ Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace * with your frontend domain for more security
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { username } = req.query;
  const cleanUsername = (username || '').replace('@', '').trim();

  if (!/^[a-zA-Z0-9._]{1,30}$/.test(cleanUsername)) {
    return res.status(400).json({ valid: false, error: 'Invalid format' });
  }

  try {
    const instaRes = await fetch(`https://www.instagram.com/${cleanUsername}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html'
      }
    });

    const html = await instaRes.text();
    const isValid = instaRes.status === 200 && html.includes('profilePage_');

    return res.status(200).json({
      valid: isValid,
      exists: isValid,
      username: cleanUsername
    });
  } catch (error) {
    return res.status(500).json({ valid: false, error: 'Server error' });
  }
      }
