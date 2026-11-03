let memC = global._caregivers || [];
export default function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');
 res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
 res.setHeader('Access-Control-Allow-Headers','Content-Type');
 if(req.method==='OPTIONS') return res.status(200).end();
 if(req.method==='GET') return res.status(200).json(memC);
 if(req.method==='POST'){
  const c=req.body;c.id=Date.now();c.verified=false;memC.unshift(c);global._caregivers=memC;
  return res.status(200).json({success:true,caregiver:c});
 }
 if(req.method==='DELETE'){
  const {id}=req.query;memC=memC.filter(x=>x.id!=id);global._caregivers=memC;
  return res.status(200).json({success:true});
 }
 return res.status(405).json({error:'Method not allowed'});
}
