## Context

O `md-server` serve apenas `.md` hoje. O `scanner.ts` filtra por extensão, o `server.ts` passa tudo pelo `marked`, e o `renderer.ts` só conhece markdown. A proposta expande para qualquer arquivo de código numa whitelist de extensões, usando a lib `ignore` para respeitar `.gitignore` aninhados, e suprimindo conteúdo de código no modo `--speech`.

Arquitetura atual: `scanner` → lista de `.md` → `server` rota `/file/*` → `renderer` → `templates`.

## Goals / Non-Goals

**Goals:**
- Servir arquivos de código de uma whitelist de extensões com syntax highlighting
- Respeitar todos os `.gitignore` aninhados no diretório servido
- Sidebar exibe nome completo com extensão
- `--speech` suprime conteúdo de arquivos de código, mostra só identificador
- Zero mudança na experiência de arquivos `.md` existentes

**Non-Goals:**
- Servir arquivos binários (imagens, PDFs, executáveis)
- Suporte a `.gitignore` global do usuário (`~/.gitignore`)
- Edição de arquivos no browser
- Busca dentro do conteúdo dos arquivos

## Decisions

### 1. Rendering de código: wrapping em markdown fenced block

Arquivos de código são wrappados em ` ```lang\nconteúdo\n``` ` antes de passar ao `marked()`. O hljs existente no browser faz o syntax highlight.

**Alternativa considerada**: gerar `<pre><code class="language-X">` diretamente no servidor, sem `marked`.  
**Por que rejeitado**: duplicaria lógica de escape HTML e geração de estrutura que o `marked` já faz. O wrapping reutiliza todo o pipeline existente sem tocar em `templates.ts`.

**Impacto**: nova função `renderCodeFile(content, lang)` em `renderer.ts`.

### 2. Speech suppression: detectado em `server.ts`

Quando `speech=true` e o arquivo não é `.md`, o servidor gera um placeholder `<p>[ Arquivo TypeScript: scanner.ts ]</p>` e retorna diretamente, sem chamar nenhum renderer.

**Alternativa considerada**: passar o tipo de arquivo para `renderer.ts` e tratar lá.  
**Por que rejeitado**: `server.ts` já conhece o caminho do arquivo e o flag `speech`. Adicionar contexto de tipo de arquivo ao `renderer` aumenta o acoplamento sem benefício.

### 3. Whitelist de extensões: definida em `scanner.ts`

Array estático de extensões em `scanner.ts`. Cobre linguagens de programação comuns + arquivos de config + texto. Explicitamente exclui `.env`, `.pem`, `.key`, `.pfx`.

```
Código: .ts .tsx .js .jsx .mjs .cjs .py .cs .go .rs .java .rb .php
        .c .cpp .cc .h .hpp .sh .bash .dart .swift .kt .kts .scala
Config: .yaml .yml .json .toml .ini .conf .env.example
Markup: .html .htm .css .scss .sass .less .sql .md
```

**Alternativa considerada**: detectar texto via tentativa de leitura UTF-8.  
**Por que rejeitado**: expõe `.env`, `.pem` e outros arquivos sensíveis. Whitelist é previsível e segura.

### 4. Mapa extensão → linguagem: inline em `server.ts`

`Record<string, string>` mapeando extensão (ex: `.ts`) → nome de linguagem para hljs (ex: `typescript`). Definido como constante em `server.ts`.

**Alternativa considerada**: arquivo separado `fileTypes.ts`.  
**Por que rejeitado**: o projeto tem 5 arquivos com responsabilidades claras. Um 6º arquivo só para um mapa é prematuro. Se crescer, extrai depois.

### 5. .gitignore: lib `ignore` com scan de todos os `.gitignore` no diretório

`scanner.ts` usa a lib `ignore` (50M downloads/semana, zero deps). Encontra todos os arquivos `.gitignore` no diretório servido e os carrega, respeitando caminhos relativos de cada um.

**Alternativa considerada**: ler só `.gitignore` da raiz.  
**Por que rejeitado**: `.gitignore` aninhados são padrão em monorepos. Suporte parcial levaria a arquivos gerados ou de build sendo expostos em subdiretórios.

### 6. Sidebar: exibe nome completo com extensão

`buildSidebar` em `templates.ts` passa a usar `path.basename(f)` em vez de `path.basename(f, '.md')`.

**Alternativa considerada**: agrupar sidebar por tipo de arquivo.  
**Por que rejeitado**: aumenta complexidade visual sem ganho claro. Já há agrupamento por diretório; por tipo seria uma segunda dimensão confusa.

## Risks / Trade-offs

- **Whitelist incompleta** → arquivos legítimos não aparecem. Mitigação: lista ampla inicial; usuário pode abrir issue para adicionar extensões.
- **Arquivos de código muito grandes** → `marked` recebe string grande, pode ser lento. Mitigação: sem limite definido agora; problema hipotético para o caso de uso (navegação de código, não produção).
- **Nomes duplicados entre tipos** (ex: `config.ts` e `config.md` no mesmo diretório) → sidebar exibe ambos com nome completo, sem ambiguidade.
- **`ignore` lib**: dependência nova, mas mínima (zero deps transitivos). Se remover no futuro, substituir por leitura manual do `.gitignore` da raiz é trivial.
