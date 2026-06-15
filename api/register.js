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

  const EVENT_ID = '1991886709769';
  const TOKEN = process.env.EVENTBRITE_PRIVATE_TOKEN;

  try {
    // Get the ticket class ID for this event
    const classRes = await fetch(`https://www.eventbriteapi.com/v3/events/${EVENT_ID}/ticket_classes/`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
    const classData = await classRes.json();

    if (!classRes.ok || !classData.ticket_classes?.length) {
      return res.status(400).json({ error: 'Could not find ticket class' });
    }

    const ticketClassId = classData.ticket_classes[0].id;

    // Create the attendee
    const response = await fetch(`https://www.eventbriteapi.com/v3/events/${EVENT_ID}/attendees/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        attendee: {
          profile: {
            name,
            email,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '-'
          },
          ticket_class_id: ticketClassId,
          quantity: 1
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.status_code === 409 || (data.error_description || '').toLowerCase().includes('sold out')) {
        return res.status(409).json({ error: 'sold_out' });
      }
      return res.status(400).json({ error: data.error_description || 'Registration failed' });
    }

    return res.status(200).json({ success: true, attendee_id: data.id });

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
