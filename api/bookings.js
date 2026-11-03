import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    if (req.method === 'GET') {
      const bookings = await kv.get('bookings') || [];
      return res.status(200).json(bookings);
    }
    if (req.method === 'POST') {
      const data = req.body;
      data.id = Date.now();
      data.created = new Date().toLocaleString();
      data.status = 'pending';
      const bookings = await kv.get('bookings') || [];
      bookings.push(data);
      await kv.set('bookings', bookings);
      return res.status(200).json({ ok: true, id: data.id });
    }
    if (req.method === 'PUT') {
      const { id, status } = req.body;
      let bookings = await kv.get('bookings') || [];
      bookings = bookings.map(b => b.id == id ? { ...b, status } : b);
      await kv.set('bookings', bookings);
      return res.status(200).json({ ok: true });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
