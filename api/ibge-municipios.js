/**
 * Proxy (Vercel serverless) para buscar municípios no IBGE.
 * Motivo: reduzir problemas de timeout/rede/CORS quando o navegador tenta falar direto com o IBGE.
 *
 * GET /api/ibge-municipios?estado=SP
 * Retorna: [{ id, nome }, ...]
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url || '/', 'https://vercel.app');
    const estado = String(url.searchParams.get('estado') || '').toUpperCase();

    if (!/^[A-Z]{2}$/.test(estado)) {
      return res.status(400).json({ error: 'estado inválido (use sigla de 2 letras, ex.: SP)' });
    }

    const upstreamUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;
    const upstreamRes = await fetch(upstreamUrl);
    if (!upstreamRes.ok) {
      const detail = await upstreamRes.text().catch(() => '');
      return res.status(502).json({
        error: `Falha ao consultar IBGE (${upstreamRes.status})`,
        detail: detail.slice(0, 200),
      });
    }

    const data = await upstreamRes.json();
    const municipiosList = Array.isArray(data)
      ? data.map(m => ({ id: m.id, nome: m.nome }))
      : [];

    return res.status(200).json(municipiosList);
  } catch (err) {
    console.error('[ibge-municipios] error:', err);
    return res.status(500).json({
      error: 'Erro ao buscar municípios no IBGE.',
    });
  }
}

