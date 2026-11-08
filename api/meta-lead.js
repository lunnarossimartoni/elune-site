// Vercel: fica em /api/meta-lead  →  no site, CAPI_ENDPOINT = '/api/meta-lead'
const { sendLead } = require('./_core');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
  const out = await sendLead({ body, ip, userAgent: req.headers['user-agent'] });
  res.status(out.status).json(out.json);
};
