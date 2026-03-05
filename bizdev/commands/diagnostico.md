---
description: Diagnóstico de saúde do pipeline (Pipeline Activity Score)
allowed-tools: Read, Grep, mcp__*linear*__*
---

Carregar a skill bizdev-helper e executar a capability "Diagnóstico do Pipeline".

Ler primeiro:
- `${CLAUDE_PLUGIN_ROOT}/skills/bizdev-helper/references/pipeline-context.md` para contexto da estrutura do Linear
- `${CLAUDE_PLUGIN_ROOT}/skills/bizdev-helper/references/pipeline-scoring.md` para sistema completo de scoring

Se $ARGUMENTS contiver o nome de um projeto específico, usar esse projeto. Caso contrário, perguntar qual projeto/funil (ou todos).

Calcular os 4 componentes do Pipeline Activity Score: Freshness (30pts), Coverage (25pts), Progression (25pts), Stale Ratio (20pts). Apresentar score consolidado + breakdown + recomendações conforme formato definido na skill.
