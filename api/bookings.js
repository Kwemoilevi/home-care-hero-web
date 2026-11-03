export default async function handler(req, res){
 res.setHeader('Access-Control-Allow-Origin','*');
 if(req.method==='OPTIONS') return res.status(200).end();
 if(req.method==='GET'){ try{ const {kv}=await import('@vercel/kv'); const data=await kv.get('bookings')||[]; return res.json(data); }catch(e){ return res.json([]); } }
 if(req.method==='POST'){ try{ const {kv}=await import('@vercel/kv'); let b=await kv.get('bookings')||[]; req.body.id=Date.now(); b.push(req.body); await kv.set('bookings',b); return res.json({ok:true}); }catch(e){ return res.json({ok:true}); } }
 if(req.method==='PUT'){ try{ const {kv}=await import('@vercel/kv'); let b=await kv.get('bookings')||[]; b=b.map(x=> x.id==req.body.id?{...x,status:req.body.status}:x); await kv.set('bookings',b); return res.json({ok:true}); }catch(e){ return res.json({ok:true}); } }
 return res.status(405).json({error:'no'});
}
