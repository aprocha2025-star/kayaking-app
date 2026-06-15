// api/register.js — Vercel serverless function
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const formId = '1FAIpQLSdN31zrkETP1W8qv8SeRWGZU2wi2b0NXc-pb7gpw4BuHIvNgg';
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

  const body = new URLSearchParams({
  'emailAddress': email,
  'entry.928657862': name,
});

  try {
    const response = await fetch(formUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      redirect: 'manual', // Google Forms redirects on success — that's fine
    });

    // Google Forms returns a 200 or 302 on success
    if (response.status === 200 || response.status === 302) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: `Unexpected status: ${response.status}` });
    }
  } catch (err) {
    console.error('Google Forms submission error:', err);
    return res.status(500).json({ error: 'Submission failed' });
  }
}
