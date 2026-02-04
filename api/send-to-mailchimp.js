import { createHash } from 'crypto';

const MAILCHIMP_DC = 'us22';
const MAILCHIMP_API_BASE = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0`;

/**
 * Rota que recebe um JSON e envia os dados APENAS para o Mailchimp (sem Blob, sem formulário).
 * POST /api/send-to-mailchimp
 * Body: { "contacts": [ { "email", "nomeCompleto", "estado", "municipio" }, ... ] }
 * Ou um único contato: { "email", "nomeCompleto", "estado", "municipio" }
 * Requer: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID na Vercel.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!apiKey || !listId) {
    return res.status(500).json({
      error: 'MAILCHIMP_API_KEY ou MAILCHIMP_LIST_ID não configurados na Vercel.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const rawContacts = Array.isArray(body)
      ? body
      : Array.isArray(body.contacts)
        ? body.contacts
        : body.contact
          ? [body.contact]
          : [body];
    const contacts = rawContacts.map((c) => ({
      email: (c.email || '').trim(),
      nomeCompleto: (c.nomeCompleto || c.nome || '').trim(),
      estado: (c.estado || '').trim(),
      municipio: (c.municipio || '').trim(),
    })).filter((c) => c.email);

    if (contacts.length === 0) {
      return res.status(400).json({
        error: 'Envie um JSON com "contacts" (array) ou um objeto com email, nomeCompleto, estado, municipio.',
      });
    }

    const auth = Buffer.from(`apikey:${apiKey}`).toString('base64');
    const results = { sent: 0, errors: [] };

    for (const c of contacts) {
      const nomeCompleto = c.nomeCompleto || '—';
      const municipio = c.municipio || 'Não informado';
      const estado = c.estado || 'Não informado';
      const [fname = '', ...rest] = nomeCompleto.split(/\s+/);
      const lname = rest.join(' ').trim();
      const subscriberHash = createHash('md5').update(c.email.toLowerCase()).digest('hex');
      const addr1 = [municipio, estado].filter(Boolean).join(', ') || 'Não informado';
      const mailchimpBody = {
        email_address: c.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fname || nomeCompleto,
          LNAME: lname,
          MMERGE5: municipio,
          MMERGE6: estado,
          ADDRESS: {
            addr1,
            addr2: '',
            city: municipio,
            state: estado,
            zip: '00000-000',
            country: 'Brazil',
          },
        },
      };
      const url = `${MAILCHIMP_API_BASE}/lists/${listId}/members/${subscriberHash}`;
      const mailchimpRes = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(mailchimpBody),
      });
      if (mailchimpRes.ok) {
        results.sent += 1;
      } else {
        const errText = await mailchimpRes.text();
        results.errors.push({ email: c.email, status: mailchimpRes.status, detail: errText.slice(0, 200) });
      }
    }

    return res.status(200).json({
      ok: true,
      sent: results.sent,
      total: contacts.length,
      errors: results.errors.length ? results.errors : undefined,
    });
  } catch (err) {
    console.error('[send-to-mailchimp] error:', err);
    return res.status(500).json({
      error: 'Erro ao enviar para o Mailchimp.',
      detail: err.message,
    });
  }
}
