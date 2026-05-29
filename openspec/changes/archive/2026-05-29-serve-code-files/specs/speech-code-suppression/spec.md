## ADDED Requirements

### Requirement: --speech suprime conteúdo de arquivos de código
Quando o servidor é iniciado com `--speech`, o sistema SHALL substituir o conteúdo de arquivos de código por um identificador textual, em vez de renderizar o código.

#### Scenario: Arquivo de código acessado em modo speech
- **WHEN** o servidor roda com `--speech` e o usuário acessa `GET /file/src/scanner.ts`
- **THEN** a página exibe apenas o texto `[ Arquivo TypeScript: scanner.ts ]` no lugar do conteúdo

#### Scenario: Arquivo .md acessado em modo speech
- **WHEN** o servidor roda com `--speech` e o usuário acessa `GET /file/README.md`
- **THEN** o conteúdo markdown é renderizado normalmente (comportamento inalterado do speech mode)

#### Scenario: Identificador usa nome de linguagem legível
- **WHEN** o arquivo suprimido é `.py`
- **THEN** o texto exibido menciona "Python" (não a extensão crua `.py`)

#### Scenario: Extensão sem linguagem mapeada
- **WHEN** o arquivo suprimido tem extensão sem mapeamento de linguagem (ex: `.conf`)
- **THEN** o texto exibido usa a extensão: `[ Arquivo .conf: nginx.conf ]`
