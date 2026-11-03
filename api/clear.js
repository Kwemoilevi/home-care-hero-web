import { kv } from '@vercel/kv';
export default async (req,res)=>{ await kv.set('bookings',[]); res.json({cleared:true}) }
