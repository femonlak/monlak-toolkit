---
description: Montar plano de ataque comercial do dia
allowed-tools: Read, Grep, mcp__*linear*__*, mcp__*slack*__*
---

Carregar a skill bizdev-helper e executar a capability "Plano de Ataque Comercial".

Ler primeiro `${CLAUDE_PLUGIN_ROOT}/skills/bizdev-helper/references/pipeline-context.md` para contexto da estrutura do Linear.

Se $ARGUMENTS contiver o nome de um projeto específico, usar esse projeto. Caso contrário, perguntar qual projeto/funil (ou todos).

Seguir o workflow e formato de saída definidos na skill para o Plano de Ataque.
