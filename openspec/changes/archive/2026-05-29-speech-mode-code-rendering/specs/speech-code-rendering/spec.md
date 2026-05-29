## ADDED Requirements

### Requirement: Arquivos de código renderizam conteúdo em modo speech
O sistema SHALL renderizar o conteúdo real de arquivos de código quando `speech=true`, usando formatação TTS-friendly em vez de suprimir o conteúdo.

#### Scenario: Arquivo TypeScript servido em modo speech
- **WHEN** servidor recebe request para arquivo `.ts` com `speech=true`
- **THEN** resposta HTML contém o conteúdo do arquivo dentro de `<p>` com `style="font-family:monospace;white-space:pre-wrap"`

#### Scenario: Arquivo de código qualquer não exibe placeholder
- **WHEN** servidor recebe request para qualquer extensão de código suportada com `speech=true`
- **THEN** resposta HTML NÃO contém o padrão `[ Arquivo`

#### Scenario: Quebras de linha preservadas
- **WHEN** arquivo de código tem múltiplas linhas
- **THEN** cada quebra de linha é convertida em `<br>` no HTML gerado

#### Scenario: Modo normal não afetado
- **WHEN** servidor recebe request para arquivo de código com `speech=false`
- **THEN** resposta HTML usa `<pre><code>` com highlight.js (comportamento atual preservado)
