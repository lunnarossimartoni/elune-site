// Lógica comum: monta o evento e envia para a API de Conversões do Meta.
// O token vem SEMPRE da variável de ambiente META_CAPI_TOKEN (nunca do código).
const PIXEL_ID = '1125011989912536';

async function sendLead({ body, ip, userAgent }) {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return { status: 500, json: { error: 'META_CAPI_TOKEN não configurado' } };
  if (!body || body.event_name !== 'Lead' || !body.event_id) return { status: 400, json: { error: 'evento inválido' } };

  const user_data = { client_ip_address: ip, client_user_agent: userAgent };
  if (body.fbp) user_data.fbp = body.fbp;
  if (body.fbc) user_data.fbc = body.fbc;

  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: String(body.event_id),
      action_source: 'website',
      event_source_url: body.event_source_url,
      user_data,
      custom_data: { content_name: body.content_name || 'WhatsApp' }
    }]
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  return { status: r.ok ? 200 : 502, json: await r.json().catch(() => ({})) };
}
module.exports = { sendLead };
