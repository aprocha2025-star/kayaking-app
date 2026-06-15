export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const formId = '1FAIpQLSdN31zrkETP1W8qv8SeRWGZU2wi2b0NXc-pb7gpw4BuHIvNgg';
  const params = new URLSearchParams({
    'entry.928657862': name,
    'entry.1349659481': email
  });

  try {
    await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Submission failed' });
  }
}
