# Configuração para Deploy em Subpasta

Este projeto está configurado para funcionar na subpasta `/campanhacidadeslp/` através de um proxy reverso Nginx.

## Configurações Realizadas

### 1. Vite Config (`vite.config.js`)
- Base path configurado para `/campanhacidadeslp/`
- Assets serão gerados com o prefixo correto automaticamente

### 2. Caminhos de Imagens
- Todas as imagens usam a função helper `getImagePath()` que utiliza `import.meta.env.BASE_URL`
- Isso garante que os caminhos sejam ajustados automaticamente

### 3. Roteamento
- O `App.jsx` foi ajustado para remover o base path ao verificar rotas
- Funciona corretamente mesmo quando acessado via `/campanhacidadeslp/`

## Como Fazer o Deploy

1. **Build do Projeto:**
   ```bash
   npm run build
   ```

2. **Deploy no Vercel:**
   - O Vercel irá fazer o build automaticamente
   - Os assets serão gerados com o prefixo `/campanhacidadeslp/`

3. **Configuração do Nginx (no servidor):**
   ```nginx
   location /campanhacidadeslp/ {
       proxy_pass https://seu-projeto.vercel.app/;
       proxy_set_header Host seu-projeto.vercel.app;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```

## Verificação

Após o deploy, verifique:
- ✅ HTML aponta para `/campanhacidadeslp/assets/...` em vez de `/assets/...`
- ✅ Imagens carregam corretamente
- ✅ CSS e JS são carregados corretamente
- ✅ Rotas funcionam corretamente

## Notas Importantes

- O Vite processa automaticamente o `index.html` durante o build
- Todos os caminhos de assets são ajustados automaticamente
- A função `getImagePath()` garante que imagens funcionem em qualquer contexto

