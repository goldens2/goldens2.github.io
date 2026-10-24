# Portfólio — Gabriel Meira Carvalho

Site estático e responsivo para apresentar projetos de Ciência de Dados, com uma demonstração interativa de monitoramento hídrico. Preparado para publicação gratuita no **GitHub Pages**.

## O que você encontrará

- Página inicial com apresentação, projetos, competências, trajetória e contato.
- Página `/projetos/monitoramento-hidrico/` com gráficos de série temporal, controles e exportação CSV.
- Tema claro/escuro e layout responsivo para celular.
- HTML, CSS e JavaScript puro: sem dependências de build, sem servidor e sem pagamentos.

> **Atenção:** a demonstração usa **dados sintéticos**. Não se trata de medições da pesquisa real, nem de um sistema validado para diagnosticar estresse hídrico. O limite usado no gráfico é ilustrativo.

## Configure seus links antes de publicar

Abra `assets/config.js` e complete os campos:

```js
window.PORTFOLIO_CONFIG = {
  github: "https://github.com/SEU_USUARIO",
  linkedin: "https://www.linkedin.com/in/SEU_PERFIL/",
  email: "seuemail@exemplo.com",
  curriculum: "" // opcional: URL HTTPS de um currículo público
};
```

Campos em branco não criam links falsos. Se deixar todos em branco, a página exibirá um aviso de configuração na seção de contato. O arquivo é público: **nunca insira senha, token ou chave privada**.

Confira se nome, formação, tecnologias, localização e descrições profissionais estão corretos antes de tornar o site público.

## Publicar pelo GitHub Pages (sem terminal)

1. Entre no [GitHub](https://github.com/), faça login e crie um repositório **público** chamado `SEU_USUARIO.github.io` (substitua `SEU_USUARIO` pelo login da sua conta).
2. Extraia o ZIP do portfólio. **Envie o conteúdo da pasta**, não a pasta que contém os arquivos: `index.html` precisa ficar na raiz do repositório.
3. Abra o repositório no GitHub → **Add file** → **Upload files**. Faça upload de `index.html`, `README.md`, `.nojekyll`, a pasta `assets/` e a pasta `projetos/`. Caso o envio pela interface não preserve a estrutura de pastas no seu navegador, use o GitHub Desktop (instruções abaixo).
4. Abra **Settings → Pages → Build and deployment**. Em **Source** escolha `Deploy from a branch`; em **Branch** escolha `main`, pasta `/(root)` e clique em **Save**.
5. Depois que o GitHub concluir a publicação, seu site ficará em `https://SEU_USUARIO.github.io/`.

**Outra forma fácil:** instale [GitHub Desktop](https://desktop.github.com/), clone seu repositório `SEU_USUARIO.github.io`, copie para ele todos os arquivos extraídos do ZIP e clique em **Commit to main** e **Push origin**. Isso mantém as pastas corretas.

Se usar um repositório com outro nome, a URL será `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/`. Os links internos do portfólio são relativos e funcionam nesse caso.

## Testar no computador

Abra `index.html` no navegador ou, a partir da pasta do projeto, rode:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/`.

## Organização dos arquivos

```text
portfolio-gabriel/
├── index.html
├── .nojekyll
├── README.md
├── assets/
│   ├── config.js
│   ├── dashboard.js
│   ├── favicon.svg
│   ├── main.js
│   ├── og-cover.svg
│   └── styles.css
└── projetos/
    └── monitoramento-hidrico/
        └── index.html
```

## Evoluções sugeridas

- Incluir gráficos gerados a partir de leituras reais **depois da validação experimental**.
- Adicionar repositórios e relatórios dos projetos quando estiverem disponíveis.
- Publicar uma análise exploratória em Python e um exemplo SQL com documentação.
- Criar um currículo em PDF com link público e preencher `curriculum` no arquivo de configuração.

Conteúdo e código podem ser adaptados livremente ao seu perfil.
