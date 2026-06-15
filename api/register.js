export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    await fetch('https://script.google.com/macros/s/AKfycbyLaroLOmDG9hiFXcLd1wZiADALyCLpSil_RWEmkf0aO1NhYEfy048Lvv7PQ5ozYMVc5w/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
      redirect: 'follow',
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Submission failed' });
  }
}
