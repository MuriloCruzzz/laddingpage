import { put, list } from '@vercel/blob';
import { createHash } from 'crypto';

const INSCRICOES_PATH = 'campanha-inscricoes/inscricoes.json';
const MAILCHIMP_DC = 'us20';
const MAILCHIMP_API_BASE = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0`;

/**
 * API serverless da Vercel: recebe dados do formulário da campanha, armazena
 * no Vercel Blob e adiciona/atualiza o contato no Mailchimp (apenas campos do formulário).
 * Requer: BLOB_READ_WRITE_TOKEN, MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID.
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

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const nomeCompleto = (body.nomeCompleto || '').trim();
    const email = (body.email || '').trim();
    const estado = (body.estado || '').trim();
    const municipio = (body.municipio || '').trim();

    if (!nomeCompleto || !email || !estado || !municipio) {
      return res.status(400).json({
        error: 'Campos obrigatórios: nomeCompleto, email, estado, municipio',
      });
    }

    const now = new Date();
    const submittedAt = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-') + ' ' + [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join(':');

    const payload = {
      nomeCompleto,
      email,
      estado,
      municipio,
      submittedAt,
    };

    let inscricoes = [];
    const { blobs } = await list({ prefix: INSCRICOES_PATH, limit: 1 });
    if (blobs.length > 0 && blobs[0].url) {
      const resp = await fetch(blobs[0].url);
      const text = await resp.text();
      if (text) {
        try {
          inscricoes = JSON.parse(text);
        } catch (_) {
          inscricoes = [];
        }
      }
    }
    if (!Array.isArray(inscricoes)) inscricoes = [];
    inscricoes.push(payload);

    await put(INSCRICOES_PATH, JSON.stringify(inscricoes, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });

    // Mailchimp: apenas dados do formulário (campos do público: FNAME, LNAME, MERGE7, MERGE8)
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    if (apiKey && listId) {
      const [fname = '', ...rest] = nomeCompleto.split(/\s+/);
      const lname = rest.join(' ').trim();
      const subscriberHash = createHash('md5').update(email.toLowerCase()).digest('hex');
      const mailchimpBody = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fname || nomeCompleto,
          LNAME: lname,
          MERGE7: municipio,
          MERGE8: estado,
        },
      };
      const auth = Buffer.from(`apikey:${apiKey}`).toString('base64');
      const mailchimpRes = await fetch(
        `${MAILCHIMP_API_BASE}/lists/${listId}/members/${subscriberHash}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify(mailchimpBody),
        }
      );
      if (!mailchimpRes.ok) {
        const errBody = await mailchimpRes.text();
        console.error('Mailchimp error:', mailchimpRes.status, errBody);
      }
      // Não falha a resposta ao usuário: inscrição já foi salva no Blob
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-form error:', err);
    return res.status(500).json({
      error: 'Falha ao salvar inscrição. Tente novamente.',
    });
  }
}
