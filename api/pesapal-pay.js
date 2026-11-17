// 1. Get Token from Pesapal
const auth = await fetch('https://pay.pesapal.com/v3/api/Auth/RequestToken', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    consumer_key: process.env.PESAPAL_KEY,
    consumer_secret: process.env.PESAPAL_SECRET
  })
});
const { token } = await auth.json();

// 2. Create Order
const order = await fetch('https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'JOB-' + Date.now(), // Your Job ID
    currency: 'UGX',
    amount: 50000,
    description: 'Home Care Nurse Booking',
    callback_url: 'https://home-care-hero-web.vercel.app/payment-success',
    notification_id: process.env.PESAPAL_IPN_ID, // From Pesapal Dashboard
    billing_address: { phone_number: '0772101875', first_name: 'Client' }
  })
});
const data = await order.json();
// Send data.redirect_url back to frontend, open it
