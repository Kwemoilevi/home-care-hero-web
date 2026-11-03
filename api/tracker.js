let memT = global._tracker || [];
export default function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS') return res.status(200).end();
 if(req.method==='GET') return res.status(200).json(memT);
 if(req.method==='POST'){
  const p=req.body; // {id,name,lat,lng,time}
  memT=memT.filter(x=>x.id!==p.id);memT.push(p);global._tracker=memT;
  return res.status(200).json({success:true});
 }
 if(req.method==='DELETE'){memT=[];global._tracker=memT;return res.status(200).json({success:true});}
 return res.status(405).json({error:'Method not allowed'});
}
