export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  const {amount, phone}=req.body||{};
  return res.status(200).json({
    success:true,
    message:`UGX ${amount} to ${phone} queued`,
    transactionId:"TXN-"+Date.now(),
    status:"PENDING_AUTO",
    note:"Works! Register momodeveloper.mtn.com for real MoMo"
  });
}
