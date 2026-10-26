// REAL MTN MOMO COLLECTION - DEDUCTS MONEY LIKE BETPAWA
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { phone, amount, bookingId } = req.body;
  
  // CLEAN PHONE: 077... -> 25677...
  let momoPhone = phone.replace(/\D/g,'');
  if (momoPhone.startsWith('0')) momoPhone = '256' + momoPhone.slice(1);
  if (!momoPhone.startsWith('256')) momoPhone = '256' + momoPhone;

  const API_USER = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const API_KEY = '639b1166df41445092abe2e674cb8307';
  const SUBSCRIPTION_KEY = process.env.MOMO_SUBSCRIPTION_KEY; // Your Primary Key from dashboard
  const ENVIRONMENT = 'sandbox'; // Change to 'mtnuganda' for LIVE

  const baseUrl = ENVIRONMENT === 'sandbox' 
    ? 'https://sandbox.momodeveloper.mtn.com' 
    : 'https://proxy.momoapi.mtn.com';

  try {
    // 1. GET ACCESS TOKEN
    const tokenRes = await fetch(`${baseUrl}/collection/token/`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        'Authorization': 'Basic ' + Buffer.from(`${API_USER}:${API_KEY}`).toString('base64')
      }
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    if (!token) throw new Error('Failed to get token: ' + JSON.stringify(tokenData));

    // 2. REQUEST TO PAY - THIS DEDUCTS MONEY!
    const X_Reference_Id = crypto.randomUUID();
    const payRes = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Reference-Id': X_Reference_Id,
        'X-Target-Environment': ENVIRONMENT,
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'UGX',
        externalId: bookingId || Date.now().toString(),
        payer: { partyIdType: 'MSISDN', partyId: momoPhone },
        payerMessage: 'Payment for Home Care Hero',
        payeeNote: 'Home Care Service'
      })
    });

    if (payRes.status === 202) {
      return res.json({ success: true, message: 'Check your phone for MTN prompt! Enter PIN to pay.', referenceId: X_Reference_Id });
    } else {
      const err = await payRes.text();
      return res.status(400).json({ success: false, error: err });
    }

  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
}
