// api/momo.js - REAL MTN MoMo
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({success:false, message:'Use POST'});

  const {amount, phone} = req.body || {};
  if(!amount || !phone) return res.status(400).json({success:false, message:'Amount and phone required'});

  let momoPhone = String(phone).replace(/\D/g,'');
  if(momoPhone.startsWith('0')) momoPhone = '256'+momoPhone.slice(1);
  if(!momoPhone.startsWith('256')) momoPhone = '256'+momoPhone;
  if(momoPhone.length !== 12) return res.status(400).json({success:false, message:'Invalid MTN number. Use 077... or 25677...'});

  try {
    const subKey = process.env.MOMO_COLLECTION_SUBSCRIPTION_KEY;
    const apiUser = process.env.MOMO_COLLECTION_USER_ID;
    const apiKey = process.env.MOMO_COLLECTION_API_KEY;
    const targetEnv = process.env.MOMO_TARGET_ENVIRONMENT || 'mtnuganda';
    
    if(!subKey || !apiUser || !apiKey) throw new Error('MoMo keys missing in Vercel env');

    const baseUrl = targetEnv === 'sandbox' 
      ? 'https://sandbox.momodeveloper.mtn.com'
      : 'https://proxy.momoapi.mtn.com';

    // 1. Get token
    const tokenRes = await fetch(`${baseUrl}/collection/token/`, {
      method:'POST',
      headers:{
        'Ocp-Apim-Subscription-Key': subKey,
        'Authorization': 'Basic '+ Buffer.from(`${apiUser}:${apiKey}`).toString('base64')
      }
    });
    if(!tokenRes.ok) throw new Error('Token failed: '+ await tokenRes.text());
    const {access_token} = await tokenRes.json();

    // 2. Request to pay
    const {randomUUID} = await import('crypto');
    const refId = randomUUID();
    const payRes = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
      method:'POST',
      headers:{
        'Authorization': `Bearer ${access_token}`,
        'X-Reference-Id': refId,
        'X-Target-Environment': targetEnv,
        'Ocp-Apim-Subscription-Key': subKey,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        amount: String(Math.round(amount)),
        currency: 'UGX',
        externalId: refId,
        payer: { partyIdType:'MSISDN', partyId: momoPhone },
        payerMessage: 'Home Care Hero',
        payeeNote: 'Home Care Hero Deposit'
      })
    });

    if(payRes.status===202){
      return res.status(200).json({
        success:true,
        transactionId: refId,
        status:'PENDING',
        message: `UGX ${amount} request sent to ${phone}. APPROVE on your phone now.`
      });
    } else {
      throw new Error(await payRes.text());
    }
  } catch(e){
    console.error(e);
    return res.status(500).json({success:false, message:e.message});
  }
}
