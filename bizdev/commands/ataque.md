---
description: Montar plano de ataque comercial do dia
allowed-tools: Read, Grep, mcp__*linear*__*, mcp__*slack*__*
---

Carregar a skill bizdev-helper e executar a capability "Plano de Ataque Comercial".

Ler primeiro `${CLAUDE_PLUGIN_ROOT}/skills/bizdev-helper/references/pipeline-context.md` para contexto da estrutura do Linear.

**Regras fixas do /ataque:**

1. **Sempre rodar em TODOS os projetos/pipelines** (Poker Operators, Offline Cashier, Affiliate Partners, Payment Integrations). Nunca perguntar qual projeto. Ignorar $ARGUMENTS relacionados a projeto.

2. **Filtrar apenas issues assigned ao usuário que pediu o comando.** Usar Linear:get_user com "me" para identificar o usuário, depois filtrar Linear:list_issues com assignee = "me" em cada projeto.

3. **Incluir seção obrigatória de "Oportunidades Mapeadas e Paradas"** no final do plano. São issues ativas (To Contact a In Discussion) assigned ao usuário que **não possuem nenhum comentário**. Para cada uma, cobrar ação com tom de coach provocativo. Ver formato na skill.

Seguir o workflow e formato de saída definidos na skill para o Plano de Ataque.
