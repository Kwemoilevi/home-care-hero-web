// api/momo-status.js - check if payment approved
export default async function handler(req, res){
  const {id} = req.query;
  if(!id) return res.status(400).json({success:false});
  try{
    const subKey = process.env.MOMO_COLLECTION_SUBSCRIPTION_KEY;
    const apiUser = process.env.MOMO_COLLECTION_USER_ID;
    const apiKey = process.env.MOMO_COLLECTION_API_KEY;
    const targetEnv = process.env.MOMO_TARGET_ENVIRONMENT || 'mtnuganda';
    const baseUrl = targetEnv==='sandbox' ? 'https://sandbox.momodeveloper.mtn.com' : 'https://proxy.momoapi.mtn.com';
    
    const tokenRes = await fetch(`${baseUrl}/collection/token/`, {
      method:'POST',
      headers:{'Ocp-Apim-Subscription-Key': subKey, 'Authorization':'Basic '+Buffer.from(`${apiUser}:${apiKey}`).toString('base64')}
    });
    const {access_token} = await tokenRes.json();
    
    const statusRes = await fetch(`${baseUrl}/collection/v1_0/requesttopay/${id}`,{
      headers:{'Authorization':`Bearer ${access_token}`,'X-Target-Environment':targetEnv,'Ocp-Apim-Subscription-Key':subKey}
    });
    const data = await statusRes.json();
    return res.status(200).json(data);
  }catch(e){ return res.status(500).json({success:false,message:e.message})}
}
