TÍTULO: WIP: Ajustes de tema, landing e ações rápidas — preparar para revisão

DESCRIÇÃO:

- Corrige contraste e tokens para modo escuro; torna componentes UI (Button, Card, EmptyState) dependentes do tema.
- Atualiza `LandingPage` para esconder Registrar/Login quando usuário está logado e adiciona botão "Início" que retorna ao dashboard.
- Torna botões de ação rápida do `StudentDashboard` funcionais e adiciona telas placeholders: `Reports` e `Medications`.
- Melhora `AccessibilityButton` e corrige background do tema claro para melhorar contraste e legibilidade.

NOTAS:
- Algumas mudanças no fluxo de registro/perfil (campos CPF, RA, responsável) foram planejadas mas estão pendentes — ver o TODO no repositório.
- Este PR contém muitas pequenas correções de UI e estilos; recomendo revisar os arquivos alterados por áreas (theme/ui, landing, student-dashboard).

CHECKLIST:
- [ ] Revisar e validar cores em modo escuro (WCAG AA).
- [ ] Reconciliar/reativar campos de registro e perfil (CPF, RA, responsável).
- [ ] Rodar testes manuais em dispositivo/emulador (cadastro, editar perfil, ações rápidas).

Você pode usar este texto como corpo do PR. Se preferir, posso atualizar o PR description diretamente (requer a CLI `gh` ou permissão via API).
