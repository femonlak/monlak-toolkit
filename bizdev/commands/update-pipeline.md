---
description: Criar project update do pipeline para o Linear
allowed-tools: Read, Grep, mcp__*linear*__*
---

Carregar a skill bizdev-helper e executar a capability "Project Update do Pipeline".

Ler primeiro:
- `${CLAUDE_PLUGIN_ROOT}/skills/bizdev-helper/references/pipeline-context.md` para contexto da estrutura do Linear
- `${CLAUDE_PLUGIN_ROOT}/skills/bizdev-helper/references/pipeline-update.md` para formato e processo completo

Se $ARGUMENTS contiver o nome de um projeto específico, usar esse projeto. Caso contrário, perguntar qual projeto/funil.

Seguir o processo de 4 steps definido no reference: coletar dados, confirmar período, montar update, gerar e confirmar antes de postar.
