# Fontes do Projeto

## Fontes Instaladas

### ✅ Chinese Rocks
- **Status:** Instalada e configurada
- **Arquivo:** `chinese-rocks/chinese rocks rg.otf`
- **Uso:** Adicione a classe `font-chinese-rocks` ou use `font-family: 'Chinese Rocks'`

### ⚠️ Mighty Souly
- **Status:** Aguardando instalação manual
- **Como instalar:**
  1. Acesse: https://www.creativefabrica.com/product/mighty-souly/
  2. Faça login e baixe a fonte
  3. Crie a pasta: `public/fonts/mighty-souly/`
  4. Coloque o arquivo `.ttf` ou `.otf` na pasta
  5. Descomente e ajuste o caminho no arquivo `src/styles/fonts.css`

## Como Usar

### Via Classe CSS:
```html
<h1 className="font-chinese-rocks">Título com Chinese Rocks</h1>
<h2 className="font-mighty-souly">Título com Mighty Souly</h2>
```

### Via CSS:
```css
.titulo {
  font-family: 'Chinese Rocks', sans-serif;
}
```

### Via Variável CSS:
```css
.titulo {
  font-family: var(--font-chinese-rocks);
}
```

