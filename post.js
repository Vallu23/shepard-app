export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { pageId, accessToken, message } = req.body;
    if (!pageId || !accessToken || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const fbRes = await fetch(`https://graph.facebook.com/v25.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, access_token: accessToken }),
    });
    const data = await fbRes.json();
    if (data.error) {
      return res.status(400).json({ 
        error: data.error.message, 
        code: data.error.code, 
        type: data.error.type 
      });
    }
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
