# PRD: Identidade Visual - Cemaden Educação

## 1. Tipografia e Fontes
Este projeto utiliza três fontes principais para diferentes níveis de hierarquia:

* **Muli:** Fonte padrão para **textos gerais** e logotipia. 
    * *Uso:* Corpo de texto, labels, botões comuns.
    * *Pesos:* Extra Light até Black.
* **Might Souly:** Fonte **dinâmica** e de maior peso.
    * *Uso:* Títulos principais de destaque.
    * *Características:* Possui letras minúsculas e curvas automáticas.
* **Chinese Rocks:** Fonte condensada e robusta.
    * *Uso:* Subtítulos em textos corridos e títulos com adornos em apresentações.

---

## 2. Elementos Gráficos e Adornos
Os títulos e tópicos seguem uma regra geométrica baseada em amarelo:

### 2.1 Tópico Principal (Retângulo)
- **Formato:** Retângulo Amarelo de fundo.
- **Fonte:** Chinese Rocks.
- **Regra:** A altura do retângulo deve ser exatamente a mesma altura das letras (desconsiderando acentos ou cedilhas).

### 2.2 Subtópico (Círculo)
- **Formato:** Círculo Amarelo.
- **Fonte:** Chinese Rocks.
- **Regra:** A altura do círculo deve ser ligeiramente maior que duas linhas de texto.
- **Alinhamento:** Círculo e texto devem estar centralizados entre si.

---

## 3. Diretrizes de Desenvolvimento (Flutter)
- **Cor Primária:** Amarelo (para adornos).
- **ThemeData:** Definir 'Muli' como fonte padrão da aplicação.
- **Custom Widgets:** A IA deve criar componentes que respeitem as proporções de altura do retângulo e círculo conforme descrito acima.