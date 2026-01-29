import { put, list } from '@vercel/blob';

const INSCRICOES_PATH = 'campanha-inscricoes/inscricoes.json';

/**
 * API serverless da Vercel: recebe dados do formulário da campanha e armazena
 * no Vercel Blob em um único arquivo JSON (array), incrementando a cada inscrição.
 * Requer BLOB_READ_WRITE_TOKEN no projeto Vercel (criado ao adicionar um Blob store).
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

    const payload = {
      nomeCompleto,
      email,
      estado,
      municipio,
      submittedAt: new Date().toISOString(),
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

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-form error:', err);
    return res.status(500).json({
      error: 'Falha ao salvar inscrição. Tente novamente.',
    });
  }
}
