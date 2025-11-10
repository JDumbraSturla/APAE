Projeto: apae-app-mobile — instruções para agentes de codificação

Resumo rápido
- Esta é uma app mobile React Native usando Expo (veja `package.json`).
- Entrada: `index.js` -> `App.js`. A navegação pode ser implementada diretamente em `App.js` (app state) ou via `src/navigation/AppNavigator.jsx`.

Arquitetura e fluxos importantes
- Estado de autenticação e roteamento simples está em `App.js`: ele consulta `dataService.getCurrentUser()` para escolher telas (welcome/login/register/dashboard).
- `dataService` (em `src/dataService.js`) simula backend usando `AsyncStorage`. Operações importantes: `register`, `login`, `getCurrentUser`, `logout`, `updateUser`. Use essas funções ao implementar autenticação/CRUD local.
- Navegação: `src/navigation/AppNavigator.jsx` e `src/navigation/DashboardTabs.jsx` encapsulam a navegação baseada em `@react-navigation` — se alterar telas, atualize esses arquivos.
- Temas/tokens: `src/theme/tokens.js` contém o shape esperado para cores, tipografia, espaçamento e sombras. Evite usar chaves que não existam (por exemplo, `designTokens.colors.blue` não existe — use `neutral`, `primary`, `semantic`, etc.).

Padrões e convenções do projeto
- Componentes e telas estão em `src/` com convenção: telas no root de `src` (ex.: `LoginPage.jsx`, `TeacherDashboard.jsx`), componentes reutilizáveis em `src/components/*`, e UI primitives em `src/components/ui/`.
- Estilos: muitos componentes criam estilos localmente via `StyleSheet.create`. Para evitar erros de carregamento (circular imports), alguns componentes (ex.: `TeacherDashboard.jsx`) constroem estilos dentro do componente e aceitam `designTokens` como argumento.
- Tokens: sempre acesse propriedades existentes (ex.: `designTokens.typography.fontSizes.lg`, `designTokens.spacing.sm`). Se um token estiver ausente, prefira `neutral` ou `semantic` definidos em `src/theme/tokens.js`.

Build / execução / debugging
- Este projeto usa Expo. Scripts principais em `package.json`:
  - `npm run start` (ou `expo start`)
  - `npm run android` (abre no Android/emulador via Expo)
  - `npm run ios` (abre no iOS via Expo)
  - `npm run web` (inicia versão web)
- Ambiente local: assegure que `expo` CLI esteja instalada globalmente para uso de comandos acima. Em Windows PowerShell, execute os scripts com `npm run <script>`.
- Logs e erros de render: artefatos de erro de renderização frequentemente vêm de acessos indefinidos em tokens ou props faltantes (ex.: `Cannot convert undefined value to object` quando `designTokens.colors.blue` não existe). Verifique tokens e props `user` antes de desreferenciar.

Integrações e pontos externos
- Persistência local: `@react-native-async-storage/async-storage` via `dataService`. Não há backend remoto configurado — implementar chamadas de rede deve seguir o padrão de `dataService` (métodos async, throw erros legíveis).
- Notificações/bio: o projeto inclui dependências Expo para notificações e autenticação biométrica (`expo-notifications`, `expo-local-authentication`). Se ativar, registre handlers em `App.js` ou em serviços dedicados (ex.: `src/services/notificationService.js`).

Exemplos práticos para agentes
- Ao adicionar uma nova tela de dashboard para `role === 'teacher'`, atualize `App.js` e `src/navigation/DashboardTabs.jsx` (ou `AppNavigator.jsx`) e use `dataService.getCurrentUser()` para buscar dados locais.
- Ao usar tokens: substitua usos de `designTokens.colors.blue[700]` por `designTokens.colors.neutral[900]` ou `designTokens.colors.semantic.info` conforme `tokens.js`.
- Ao persistir dados de usuário, invoque `dataService.updateUser(updatedUser)` e trate erros com try/catch — esses métodos atualizam tanto a lista de usuários quanto `apae_current_user`.

O que evitar
- Não acessar chaves de tokens que não existem (ex.: `colors.blue`).
- Evitar importar `designTokens` em tempo de módulo em componentes que podem criar dependências circulares; prefira construir estilos dentro do componente e receber `designTokens` por import no topo quando possível.

Arquivos-chave para referência rápida
- `App.js` — roteamento com base em autenticação
- `src/dataService.js` — persistência local e contratos (inputs/outputs)
- `src/theme/tokens.js` — forma dos tokens (cores, tipografia, espaçamento)
- `src/navigation/AppNavigator.jsx`, `src/navigation/DashboardTabs.jsx` — navegação
- `src/components/ui/` — primitives de UI reutilizáveis

Se algo aqui estiver impreciso ou você quiser que eu detalhe exemplos de alteração (ex.: adicionar nova tela, alteração de tokens, ou migrar `dataService` para remoto), diga qual caso quer que eu documente e eu atualizo este arquivo.
