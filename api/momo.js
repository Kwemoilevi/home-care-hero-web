export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({success:false, message:'Use POST'});

  const {amount, phone} = req.body || {};
  if(!amount || !phone) return res.status(400).json({success:false, message:'Amount and phone required'});

  // Clean phone: 077... -> 25677...
  let momoPhone = phone.replace(/\D/g,'');
  if(momoPhone.startsWith('0')) momoPhone = '256'+momoPhone.slice(1);
  if(!momoPhone.startsWith('256')) momoPhone = '256'+momoPhone;

  try {
    const subKey = process.env.MOMO_COLLECTION_SUBSCRIPTION_KEY;
    const apiUser = process.env.MOMO_COLLECTION_USER_ID;
    const apiKey = process.env.MOMO_COLLECTION_API_KEY;
    const targetEnv = process.env.MOMO_TARGET_ENVIRONMENT || 'mtnuganda';
    const isSandbox = targetEnv === 'sandbox';

    const baseUrl = isSandbox 
      ? 'https://sandbox.momodeveloper.mtn.com'
      : 'https://proxy.momoapi.mtn.com';

    // 1. Get access token
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
    const refId = require('crypto').randomUUID();
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
        amount: String(amount),
        currency: 'UGX',
        externalId: refId,
        payer: { partyIdType:'MSISDN', partyId: momoPhone },
        payerMessage: 'Home Care Hero Payment',
        payeeNote: 'Home Care Hero'
      })
    });

    if(payRes.status===202){
      return res.status(200).json({
        success:true,
        transactionId: refId,
        status:'PENDING',
        message: `Request sent to ${phone}. Approve on your phone.`
      });
    } else {
      throw new Error('Pay failed: '+ await payRes.text());
    }

  } catch(e){
    console.error('MoMo Error', e);
    return res.status(500).json({success:false, message:e.message});
  }
}
