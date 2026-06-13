export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const response = await fetch('https://api.tickettailor.com/v1/issued_tickets', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.TICKET_TAILOR_API_KEY + ':').toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        event_id: 'ev_8506115',
        ticket_type_id: 'tt_6470886',
        full_name: name,
        email: email,
        send_email: 'false'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error && data.error.includes('sold out')) {
        return res.status(409).json({ error: 'sold_out' });
      }
      return res.status(400).json({ error: data.error || 'Registration failed' });
    }

    return res.status(200).json({ success: true, ticket_id: data.id });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
