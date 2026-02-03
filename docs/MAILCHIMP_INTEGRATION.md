# Integração do formulário com Mailchimp (envio de e-mails)

Este documento descreve o **fluxo**, as **dependências** e o **passo a passo** para usar os dados do formulário da campanha (hoje armazenados em JSON na Vercel) e integrar com o **Mailchimp**, permitindo disparar e-mails (adicionar contato à audiência, automações, campanhas etc.).

Nenhuma alteração de código é feita neste guia — apenas o que você precisa ter em mãos e a ordem recomendada das tarefas.

---

## 1. Situação atual

| Etapa | Onde | O quê |
|-------|------|--------|
| Frontend | `LPTeste2.jsx` | Formulário envia POST para `/api/submit-form` com `nomeCompleto`, `email`, `estado`, `municipio`. |
| API | `api/submit-form.js` | Valida os dados, monta um objeto com `submittedAt` e grava no **Vercel Blob** em `campanha-inscricoes/inscricoes.json`. |
| Armazenamento | Vercel Blob | Um único arquivo JSON com array de inscrições. |

Ou seja: os dados já chegam na sua API; o que falta é **enviar esses mesmos dados para o Mailchimp** (e, se quiser, usar o Mailchimp para disparar e-mails).

---

## 2. O que você precisa ter (dependências)

### 2.1 Conta e produto Mailchimp

- Conta no [Mailchimp](https://mailchimp.com) (free ou pago).
- Decisão de uso:
  - **Apenas lista/audiência** (guardar contatos para campanhas manuais ou automações).
  - **Automação** (ex.: e-mail de boas-vindas ao se inscrever).
  - **Campanhas** (e-mails que você dispara manualmente para a lista).

### 2.2 Dados de API do Mailchimp (obrigatórios para integração)

Para este projeto, o **datacenter** da sua API Key é **`us22`** (sufixo da chave). A base URL da API será: **`https://us22.api.mailchimp.com/3.0`**.

| Dado | Onde achar | Uso |
|------|------------|-----|
| **API Key** | Mailchimp: Perfil → Extras → Chaves de API (ou [API Keys](https://us22.admin.mailchimp.com/account/api/)) | Autenticar chamadas à API. **Use só em variável de ambiente (ex.: Vercel), nunca no código.** |
| **Server prefix (datacenter)** | Sufixo da API Key (no seu caso: **`us22`**) | Base URL: `https://us22.api.mailchimp.com/3.0`. |
| **Audience (List) ID** | Mailchimp: Audiência → Configurações → Chaves e códigos → ID da audiência. **Neste projeto:** `d74ca22b8f`. | Identificar em qual lista incluir o contato. |

Nenhuma alteração no código é necessária para “ter” isso — só para **usar** esses valores (por exemplo em variáveis de ambiente).

### 2.3 Variáveis de ambiente (recomendado)

- **`MAILCHIMP_API_KEY`** — Sua API Key completa (formato: `xxxxxxxx-us22`). Configure na Vercel em **Settings → Environment Variables**; não commite no repositório.
- **`MAILCHIMP_LIST_ID`** ou **`MAILCHIMP_AUDIENCE_ID`** — ID da audiência onde os inscritos serão adicionados. **Neste projeto:** `d74ca22b8f`.

Configurar no projeto na Vercel: **Project → Settings → Environment Variables**. Não coloque a API Key no código.

### 2.4 Dependências de código (quando for implementar)

- Nenhuma lib obrigatória: a API do Mailchimp é REST; você pode usar `fetch` na serverless function.
- Opcional: `@mailchimp/mailchimp_marketing` (SDK oficial em Node) se preferir usar SDK em vez de `fetch`.

---

## 3. Fluxo desejado (resumo)

```
[Usuário preenche o formulário]
        ↓
[Frontend: POST /api/submit-form]
        ↓
[API serverless (Vercel)]
        │
        ├─ 1. Validar corpo do request (como hoje)
        ├─ 2. Salvar no Vercel Blob (inscricoes.json) — como hoje
        └─ 3. (NOVO) Chamar API do Mailchimp
                │
                ├─ Adicionar/atualizar contato na audiência (email, nome, etc.)
                └─ (Opcional) Disparar e-mail via automação do Mailchimp
        ↓
[Resposta 200 para o frontend]
```

Ou seja: **um único POST** do formulário; a API continua salvando em JSON e **ainda** envia os dados ao Mailchimp.

---

## 4. Passo a passo (o que fazer na prática)

### Passo 1: Mailchimp — criar audiência e pegar IDs

1. Acesse o Mailchimp e crie uma **Audiência** (lista) para a campanha, se ainda não tiver.
2. Em **Audiência → Configurações → Chaves e códigos**, copie o **ID da audiência** (List ID).
3. Crie ou copie uma **Chave de API** (Perfil → Extras → Chaves de API).
4. O **datacenter** da sua API Key é **`us22`**. A base URL da API é:  
   `https://us22.api.mailchimp.com/3.0`.

### Passo 2: Variáveis de ambiente na Vercel

1. No dashboard da Vercel, abra o projeto.
2. **Settings → Environment Variables**.
3. Crie:
   - **`MAILCHIMP_API_KEY`** = sua API Key completa (formato `xxxxxxxx-us22`).
   - **`MAILCHIMP_LIST_ID`** = ID da audiência (neste projeto: `d74ca22b8f`).

Use o mesmo ambiente (Production/Preview) em que a API `submit-form` roda.

### Passo 3: Decidir o mapeamento dos campos

O formulário envia:

- `nomeCompleto`
- `email`
- `estado`
- `municipio`

No Mailchimp, o contato tem:

- **email_address** (obrigatório)
- **merge_fields** (ex.: FNAME, LNAME, ESTADO, MUNICIPIO — dependendo dos campos que você criar na audiência)

Mapeamento usado na API (conforme campos do seu público):

| Formulário | Mailchimp (merge tag) |
|------------|------------------------|
| `email` | `email_address` |
| `nomeCompleto` | `FNAME` (primeira palavra) + `LNAME` (resto) |
| `municipio` | `MMERGE5` (campo "Municipio") |
| `estado` | `MMERGE6` (campo "Estado") |

A API envia **apenas** esses dados; os demais campos do público (Endereço, Telefone, Birthday, Company) ficam vazios.

### Passo 4: Implementar a chamada ao Mailchimp na API (quando for codar)

Na função `api/submit-form.js`, **depois** de gravar no Blob com sucesso (para não adicionar ao Mailchimp se o Blob falhar):

1. Ler `process.env.MAILCHIMP_API_KEY` e `process.env.MAILCHIMP_LIST_ID`.
2. Montar o corpo do POST para a API do Mailchimp (endpoint de “add or update list member”).
   - Documentação: [Mailchimp API – Add or update list member](https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/).
   - URL: `POST https://us22.api.mailchimp.com/3.0/lists/d74ca22b8f/members`
   - Body (exemplo em inglês, você pode manter os nomes dos campos):
     - `email_address`
     - `status: "subscribed"` (ou `"pending"` se quiser double opt-in)
     - `merge_fields: { FNAME: "...", ESTADO: "...", MUNICIPIO: "..." }`
3. Fazer `fetch` (ou usar o SDK) com header `Authorization: Bearer <API_KEY>`.
4. Tratar erro (ex.: 400 = e-mail inválido ou já na lista): decidir se retorna 200 mesmo assim (inscrição já gravada no Blob) ou 500. Recomendação: **gravar no Blob sempre**; se o Mailchimp falhar, logar e opcionalmente retornar 200 para não bloquear o usuário.

Nenhuma alteração no frontend é obrigatória: o frontend continua enviando o mesmo POST.

### Passo 5: E-mails de fato (disparo)

- **Incluir na audiência** (Passo 4) já deixa o contato na lista. A partir daí você pode:
  - Enviar **campanhas** manuais para essa audiência.
  - Criar uma **automação** (ex.: “Quando alguém é adicionado à lista → enviar e-mail de boas-vindas”).
- Para **transacional** (ex.: um e-mail único por inscrição, tipo “Recebemos sua inscrição”), o Mailchimp não é o foco; dá para usar Mandrill (Mailchimp) ou outro serviço. Este guia foca em **lista + automações/campanhas**.

---

## O que fazer no Mailchimp para disparar e-mail de boas-vindas após o submit

Depois que a API adicionar o contato na audiência (quando você implementar o Passo 4), o Mailchimp precisa de uma **automação** que dispara o e-mail de boas-vindas assim que alguém entra na lista. Resumo do que fazer **dentro do Mailchimp**:

### 1. Ter uma audiência e o List ID

1. No Mailchimp: **Audiência** (menu principal).
2. Se ainda não tiver uma audiência para a campanha: **Criar audiência** → preencha nome, e-mail do remetente etc. → salvar.
3. Abra a audiência → **Configurações** (engrenagem) → **Chaves e códigos**.
4. Copie o **ID da audiência** (List ID). **Neste projeto:** `2659c1c46d`.
5. Na **Vercel**: **Settings → Environment Variables** → crie **`MAILCHIMP_LIST_ID`** = `2659c1c46d`. Assim a API sabe em qual lista incluir o contato.

### 2. (Opcional) Campos da audiência para personalizar o e-mail

Se quiser usar nome, estado ou município no e-mail de boas-vindas:

1. **Audiência** → sua audiência → **Configurações** → **Campos de audiência e *tags***.
2. Por padrão já existe **Nome** (FNAME). Se quiser **Estado** e **Município**, clique em **Adicionar campo** e crie, por exemplo:
   - **Tag**: `ESTADO` (nome interno que a API usará)
   - **Tag**: `MUNICIPIO`

Assim você pode usar no corpo do e-mail coisas como “Olá, *|FNAME|*” ou “*|ESTADO|*”.

### 3. Criar a automação de boas-vindas (e-mail após o submit)

1. No Mailchimp: vá em **E-mail** (ou **Marketing**) → **Automações** (ou **Automations**).
2. Clique em **Criar** (ou **Create**) e escolha um tipo que dispare quando **alguém entra na audiência**, por exemplo:
   - **“Boas-vindas”** / **“Welcome new subscribers”**, ou  
   - **“Jornada do cliente”** / **“Customer journey”** com gatilho **“Assinante adicionado à audiência”** / **“Subscriber added to audience”**.
3. Selecione a **audiência** que você está usando (a mesma cujo List ID está na Vercel).
4. Adicione a etapa **Enviar e-mail** (Send email):
   - Assunto (ex.: “Bem-vindo(a) à Campanha #AprenderParaPrevenir”).
   - Corpo do e-mail: escreva o texto de boas-vindas. Use merge tags se quiser: `*|FNAME|*`, `*|ESTADO|*`, `*|MUNICIPIO|*`.
5. Salve e **ative** a automação (toggle “Ativado” / “Turn on”).

A partir daí, sempre que um novo contato for adicionado a essa audiência (pela API após o submit do formulário), o Mailchimp dispara automaticamente esse e-mail de boas-vindas.

### 4. Resumo do fluxo completo

| Onde | O quê |
|------|--------|
| **Formulário (site)** | Usuário preenche e clica em enviar. |
| **API (Vercel)** | Recebe os dados, grava no Blob e chama a API do Mailchimp para **adicionar o e-mail à audiência** (Passo 4 da seção 4). |
| **Mailchimp** | Contato entra na audiência → a **automação de boas-vindas** dispara e envia o e-mail. |

Ou seja: você não “dispara” o e-mail manualmente; o Mailchimp dispara sozinho quando o contato é adicionado à lista pela API.

### 5. Testar

1. Garanta que a automação está **ativada** e que **MAILCHIMP_LIST_ID** está na Vercel (e que a API já está chamando o Mailchimp — Passo 4).
2. Envie o formulário com um e-mail real que você acessa.
3. Confira em **Audiência** se o contato apareceu.
4. Verifique a caixa de entrada (e spam) para ver se o e-mail de boas-vindas chegou.

Se a API ainda não estiver adicionando o contato ao Mailchimp, o próximo passo é implementar a chamada na `api/submit-form.js` (Passo 4 da seção 4). Depois disso, o fluxo acima funciona.

---

### Passo 6: Testar

1. Fazer deploy da API com as variáveis de ambiente preenchidas.
2. Enviar um formulário de teste (e-mail real que você acessa).
3. Conferir no Mailchimp em **Audiência** se o contato apareceu com os merge fields corretos.
4. Se tiver automação de boas-vindas, verificar se o e-mail foi disparado.

---

## 5. Checklist rápido

- [ ] Conta Mailchimp ativa.
- [ ] Audiência criada; ID da audiência anotado (neste projeto: `d74ca22b8f`).
- [ ] API Key criada; datacenter **us22** (sufixo da key).
- [ ] Variáveis `MAILCHIMP_API_KEY` e `MAILCHIMP_LIST_ID` configuradas na Vercel.
- [ ] Merge fields na audiência (FNAME, ESTADO, MUNICIPIO ou os que quiser).
- [ ] Implementar em `api/submit-form.js`: após salvar no Blob, chamar API Mailchimp (add/update member).
- [ ] Tratar erro do Mailchimp sem falhar a resposta ao usuário (Blob já gravado).
- [ ] Testar com um envio real e conferir na audiência e no e-mail.

---

## 6. Referências

- [Mailchimp API – List Members](https://mailchimp.com/developer/marketing/api/list-members/)
- [Add or update list member](https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/)
- [Authentication](https://mailchimp.com/developer/marketing/guides/quick-start/#authenticate) (Basic Auth com a API Key como “password”, ou Bearer em algumas rotas).

---

Este arquivo descreve apenas o **fluxo**, as **dependências** e o **passo a passo**. Quando for implementar a chamada ao Mailchimp na `api/submit-form.js`, use este guia como base e, se quiser, peça ao **backend-specialist** para escrever o código da integração seguindo validação, env vars e tratamento de erros.
