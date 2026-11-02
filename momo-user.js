export default async function handler(req, res) {
  const primaryKey = process.env.MOMO_COLLECTION_PRIMARY_KEY;
  if(!primaryKey) return res.json({error: "Add MOMO_COLLECTION_PRIMARY_KEY in Vercel first"});
  
  const { v4: uuidv4 } = await import('uuid');
  const userId = uuidv4();
  
  // Step 1: Create API User
  const createUser = await fetch('https://eric.mtn.com/v1_0/apiuser', {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': primaryKey,
      'X-Reference-Id': userId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({providerCallbackHost: "home-care-hero-web.vercel.app"})
  });
  
  if(createUser.status !== 201) {
    const err = await createUser.text();
    return res.json({step:"create user failed", status:createUser.status, error:err, userId});
  }
  
  // Step 2: Create API Key
  const createKey = await fetch(`https://eric.mtn.com/v1_0/apiuser/${userId}/apikey`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': primaryKey
    }
  });
  
  const keyData = await createKey.json();
  
  return res.json({
    success: true,
    MOMO_COLLECTION_USER_ID: userId,
    MOMO_COLLECTION_API_SECRET: keyData.apiKey,
    message: "COPY these 2 values to Vercel Environment Variables NOW",
    next: "After copying, delete this file create-momo-user.js"
  });
}
