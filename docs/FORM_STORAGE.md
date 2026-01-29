# Armazenamento das inscrições do formulário (Vercel Blob)

O formulário da campanha envia os dados (Nome Completo, e-mail, estado, município) para a API `/api/submit-form`, que grava cada inscrição no **Vercel Blob** como um arquivo JSON.

## O que foi implementado

1. **API serverless** (`api/submit-form.js`): recebe POST com JSON e salva no Blob com `@vercel/blob` (um arquivo por inscrição, na pasta `campanha-inscricoes/`).
2. **Frontend** (`LPTeste2.jsx`): após validar o formulário, faz POST para `/api/submit-form`, trata sucesso/erro e mostra "Enviando..." no botão durante o envio.
3. **vercel.json**: rewrite para SPA (todas as rotas que não são `/api/*` vão para `index.html`).

## Configuração na Vercel

1. No [Dashboard da Vercel](https://vercel.com/dashboard), abra o projeto.
2. Vá em **Storage** → **Create Database** → **Blob**.
3. Crie um Blob store (ex.: `campanha-blob`). A Vercel cria automaticamente a variável **`BLOB_READ_WRITE_TOKEN`** no projeto.
4. Se for testar localmente com `vercel dev`, puxe as variáveis: `vercel env pull`.

Não é necessário configurar nada no código: a API usa `process.env.BLOB_READ_WRITE_TOKEN` automaticamente quando o projeto está ligado ao Blob.

## Domínio privado (proxy nginx)

Se o site é acessado por um domínio privado (ex.: `https://educacao.cemaden.gov.br/campanhacidadeslp/`) e o nginx redireciona ou faz proxy para a Vercel, o navegador continua no domínio privado. Nesse caso `fetch('/api/submit-form')` iria para `https://educacao.cemaden.gov.br/api/submit-form`, que não é a API na Vercel.

Para forçar a API a bater sempre na Vercel, use **`VITE_API_BASE`** no build de produção:

- **`.env.production`** (já configurado neste projeto): `VITE_API_BASE=https://laddingpage-ten.vercel.app`  
  Assim, em produção o formulário sempre envia para `https://laddingpage-ten.vercel.app/api/submit-form`, independente do domínio em que o usuário abriu a página.

Se o projeto Vercel tiver outro URL, altere em `.env.production` e faça um novo deploy.

## Desenvolvimento local

- **Produção (deploy na Vercel):** com `.env.production`, a API é sempre a URL da Vercel; funciona tanto acessando pelo domínio privado quanto pelo domínio da Vercel.
- **Local com Vite (`npm run dev`):** não existe `/api` no servidor do Vite. Opções:
  - Usar **`vercel dev`** (recomendado): sobe o app e as serverless functions; `/api/submit-form` funciona em `http://localhost:3000`.
  - Ou definir **`VITE_API_BASE`** no `.env` apontando para a URL do deploy (ex.: `https://laddingpage-ten.vercel.app`) para o formulário enviar para a API em produção.

## Formato dos dados armazenados

Cada inscrição vira um arquivo JSON no Blob, por exemplo:

```json
{
  "nomeCompleto": "Maria Silva",
  "email": "maria@exemplo.com",
  "estado": "SP",
  "municipio": "São Paulo",
  "submittedAt": "2025-01-29T14:30:00.000Z"
}
```

Os arquivos ficam em `campanha-inscricoes/` com nome no formato `YYYY-MM-DD.json` + sufixo aleatório (evita colisão).

## Alternativa: exportar como .txt

O Blob guarda os dados na nuvem (acessível pelo dashboard da Vercel e pela API). Se precisar de um `.txt` com todas as inscrições, você pode:

- Usar a API do Blob para **listar** os arquivos em `campanha-inscricoes/` e depois **baixar** cada um e concatenar em um único `.txt`, ou
- Criar uma rota admin (ex.: `api/export-inscricoes.js`) que lista os blobs, lê o conteúdo de cada um e devolve um único texto (ou CSV) para download.

Se quiser, posso esboçar essa rota de exportação em texto.
