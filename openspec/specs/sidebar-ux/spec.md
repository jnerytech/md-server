## ADDED Requirements

### Requirement: Sidebar item indentation
Os itens do sidebar (`.sidebar-item`) SHALL ter `padding-left` maior que o header do grupo (`.sidebar-group-header`), criando hierarquia visual que indica pertencimento ao grupo.

#### Scenario: Item visualmente indentado sob o header
- **WHEN** o sidebar renderiza um grupo com header e itens
- **THEN** os itens devem aparecer deslocados à direita em relação ao header do grupo

### Requirement: Sidebar scroll persistence
O scroll do sidebar SHALL ser preservado entre navegações. Ao clicar em um `.sidebar-item` e carregar a nova página, o sidebar SHALL restaurar a mesma posição de scroll que tinha antes da navegação.

#### Scenario: Clicar item no final da lista mantém posição
- **WHEN** o usuário rola o sidebar até o final e clica em um arquivo
- **THEN** a nova página carrega com o sidebar na mesma posição de scroll, mostrando o item ativo

#### Scenario: Degradação silenciosa sem sessionStorage
- **WHEN** `sessionStorage` não está disponível no browser
- **THEN** o sidebar carrega normalmente do topo, sem erros JavaScript

### Requirement: Main content inicia no topo
A área de conteúdo principal (`.content`) SHALL sempre iniciar com scroll no topo ao carregar qualquer página, independente da posição de scroll da página anterior.

#### Scenario: Navegação entre arquivos reseta conteúdo
- **WHEN** o usuário navega de um arquivo para outro pelo sidebar
- **THEN** o `.content` começa no topo da nova página
