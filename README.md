# md-server

CLI em TypeScript que serve arquivos Markdown e código-fonte como HTML no navegador. Aponte para qualquer pasta e acesse um índice navegável em `localhost`.

## O que faz

- Varre recursivamente uma pasta em busca de arquivos `.md` e arquivos de código (`.ts`, `.py`, `.cs`, `.go`, `.rs`, `.java` e [mais de 30 extensões](#extensões-suportadas))
- Respeita `.gitignore` (incluindo os aninhados em subdiretórios)
- Exibe uma sidebar com os arquivos agrupados por subdiretório
- Renderiza `.md` como HTML (GitHub Flavored Markdown) e arquivos de código com syntax highlighting
- Abre o navegador automaticamente ao iniciar
- Sem build step — roda TypeScript diretamente via `tsx`

## Instalação

### Pré-requisito: nvm + Node 22

O projeto usa [nvm](https://github.com/nvm-sh/nvm) para gerenciar a versão do Node no WSL/Linux.

```bash
# 1. Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 2. Recarregar o shell
source ~/.bashrc

# 3. Instalar Node 22 e definir como padrão
nvm install 22
nvm alias default 22
```

### Opção A — Instalar direto do GitHub (recomendado)

```bash
npm install -g github:jnerytech/md-server
```

O npm clona o repositório, instala as dependências e registra o comando `md-server` globalmente.

> **Se já tiver um `npm link` ativo**, remova-o antes para evitar conflito:
> ```bash
> cd ~/repos/md-server   # pasta local do projeto
> npm unlink             # remove o link global
> ```
> Depois rode o `npm install -g github:...` normalmente.

### Opção B — Instalar localmente com `npm link`

```bash
cd ~/repos/md-server
nvm use           # usa a versão do .nvmrc (Node 22)
npm install
npm link          # registra "md-server" como comando global
```

Após `npm link`, o comando `md-server` fica disponível em qualquer pasta nos terminais onde o nvm estiver carregado.

> **Nota WSL:** o `nvm` é carregado automaticamente em novos terminais após a instalação (o instalador adiciona as linhas necessárias no `~/.bashrc`). Se o comando não for encontrado, execute `source ~/.bashrc` ou abra um novo terminal.

## Uso

```bash
# Serve a pasta atual (*.md e arquivos de código recursivamente)
md-server

# Serve uma pasta específica
md-server ./src
md-server ../docs

# Serve um único arquivo diretamente
md-server ./guidelines/criar-endpoint.md
md-server ./src/scanner.ts

# Porta customizada
md-server ./src --port 4000

# Modo leitura (speech-friendly para Speechify e leitores TTS)
md-server ./guidelines --speech
md-server "arquivo.md" --speech

# Informações
md-server --help
md-server --version
```

### Caso de uso principal

```bash
# Navegar pelo código e docs de um projeto
cd ~/repos/meu-projeto
md-server
# → abre http://localhost com todos os .md e arquivos de código do projeto
```

## Interface

**Sidebar:** lista todos os arquivos encontrados, agrupados por subdiretório, com o nome completo incluindo extensão. Colapsável via botão toggle.

**Página de arquivo (`/file/<path>`):** renderiza conforme o tipo:
- **`.md`** — GitHub Flavored Markdown (tabelas, task lists, strikethrough)
- **Código** — bloco de código com syntax highlighting via [highlight.js](https://highlightjs.org/)

**Modo `--speech`:** renderização otimizada para leitores TTS como [Speechify](https://speechify.com/):
- Arquivos de código mostram apenas o identificador: `[ Arquivo TypeScript: scanner.ts ]`
- Blocos de código em `.md` viram `<p>` (lidos pelo TTS, separados por `<hr>`)
- Tabelas sem zebra e sem destaque no header (lidas sem pular)
- Blockquotes em `<div>` (não ignorados pelo leitor)

## Extensões suportadas

| Categoria | Extensões |
|-----------|-----------|
| TypeScript / JavaScript | `.ts` `.tsx` `.js` `.jsx` `.mjs` `.cjs` |
| Python | `.py` |
| C# | `.cs` |
| Go | `.go` |
| Rust | `.rs` |
| Java / Kotlin / Scala | `.java` `.kt` `.kts` `.scala` |
| Ruby | `.rb` |
| PHP | `.php` |
| C / C++ | `.c` `.cpp` `.cc` `.h` `.hpp` |
| Shell | `.sh` `.bash` |
| Dart / Swift | `.dart` `.swift` |
| Config / Data | `.yaml` `.yml` `.json` `.toml` `.ini` `.conf` |
| Web | `.html` `.htm` `.css` `.scss` `.sass` `.less` |
| SQL | `.sql` |
| Markdown | `.md` |

Arquivos `.env`, `.pem`, `.key` e binários são excluídos independentemente do `.gitignore`.

## Desenvolvimento

```bash
# Rodar sem instalar globalmente
npm start -- ./alguma-pasta
npm start -- ./alguma-pasta --port 4000
```

## Estrutura do projeto

```
md-server/
├── bin/
│   └── md-server       # shell wrapper executável (entry point do npm link)
└── src/
    ├── index.ts         # parse de args e validação
    ├── server.ts        # Express app, rotas e detecção de tipo de arquivo
    ├── scanner.ts       # varredura recursiva com whitelist e .gitignore
    ├── renderer.ts      # markdown → HTML e code → fenced block
    └── templates.ts     # templates HTML com CSS inline e sidebar
```

## Dependências

| Pacote | Uso |
|--------|-----|
| `express` | servidor HTTP |
| `marked` | renderização de Markdown (GFM) |
| `ignore` | filtragem de `.gitignore` aninhados |
| `open` | abre o navegador automaticamente |
| `tsx` | executa TypeScript diretamente (sem compilação) |
