// REAL API - home-hero-web.vercel.app/api/bookings
let mem = global._bookings || [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json(mem);
  }

  if (req.method === 'POST') {
    const b = req.body;
    b.id = Date.now();
    b.created = new Date().toISOString();
    if (!b.status) b.status = 'pending';
    mem.unshift(b);
    global._bookings = mem;
    return res.status(200).json({ success: true, booking: b, total: mem.length });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    mem = mem.filter(x => x.id != id);
    global._bookings = mem;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
