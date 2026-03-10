# Exemplos Reais do monlak-toolkit

Exemplos extraidos dos plugins existentes para referencia ao criar novos componentes.

## Exemplo: Skill Simples (deploy-vercel)

**Path:** `deploy-vercel/skills/deploy/SKILL.md`

```yaml
---
name: deploy
description: >
  Ciclo completo de deploy: commit, push, monitoramento Vercel, auto-fix (3x), PR e merge.
  Use quando precisar fazer deploy, commit e push, ou "faz deploy".
---

# Deploy Vercel

[Workflow de 8 fases: commit, push, monitor, fix, PR, merge...]
```

## Exemplo: Skill com References (supabase-expert)

**Path:** `supabase-expert/skills/supabase-expert/SKILL.md`

```yaml
---
name: supabase-expert
description: >
  Especialista Supabase: schema, migrations, RLS, realtime, Edge Functions e best practices.
  Use quando trabalhar com database, backend, Supabase, migrations, RLS policies.
---

# Supabase Expert

[Instrucoes com links para references/]
```

**References:** 10 arquivos em `references/` com detalhes de cada area.

## Exemplo: Skill com Context Fork (last30days)

**Path:** `last30days/skills/last30days/SKILL.md`

```yaml
---
name: last30days
description: >
  Pesquisa topicos no Reddit + X + Web dos ultimos 30 dias.
argument-hint: "[topic] for [tool]" or "[topic]"
context: fork
agent: Explore
allowed-tools: Bash, Read, Write, AskUserQuestion, WebSearch
---
```

## Exemplo: Command Simples (fix)

**Path:** `new-feature/commands/fix.md`

```yaml
---
description: investigar e corrigir bug reportado pelo usuario
---

## Start here:

O usuario reportou um bug. Investigue e corrija.

**Input do usuario:**
$ARGUMENTS

## PROCESSO

### Fase 1: Entendimento
[...]

### Fase 2: Investigacao
[...]

### Fase 3: Solucao
[...]
```

## Exemplo: Command com Tools Restritas (git-sync)

**Path:** `deploy-vercel/commands/git-sync.md`

```yaml
---
description: sincronizar repositorio local com remoto
allowed-tools: Bash(git:*)
---

## Start here:
$ARGUMENTS
[...]
```

## Exemplo: Command com Model Override (monlak-toolkit)

**Path:** `toolkit-meta/commands/monlak-toolkit.md`

```yaml
---
description: adicionar ou atualizar componente no monlak-toolkit
argument-hint: [descricao do que adicionar]
model: claude-opus-4-1
allowed-tools: Bash(git:*), Bash(curl:*), Bash(cat:*), Bash(ls:*), Bash(mkdir:*), Bash(cp:*), Bash(mv:*), Bash(rm:*)
---
```

## Exemplo: Plugin com MCP (bizdev)

**Path:** `bizdev/.mcp.json`

```json
{
  "mcpServers": {
    "linear": {
      "type": "sse",
      "url": "https://mcp.linear.app/sse"
    },
    "slack": {
      "type": "http",
      "url": "https://slack.mcp.claude.com/mcp"
    }
  }
}
```

## Exemplo: Plugin com Multiplas Skills (frontend-expert)

```
frontend-expert/
├── .claude-plugin/plugin.json
└── skills/
    ├── frontend-expert/    # Skill principal
    │   ├── SKILL.md
    │   └── references/
    └── agentation/         # Skill complementar
        └── SKILL.md
```

O plugin.json descreve o conjunto:
```json
{
  "name": "frontend-expert",
  "description": "Frontend de alta qualidade: React, React Native, design systems, UX/UI, animacoes, cross-platform e visual feedback com Agentation",
  "version": "1.0.0"
}
```

## Padroes Observados

1. **Naming:** plugin-name = skill-name na maioria dos casos
2. **Skills standalone:** Cada skill principal tem seu proprio plugin
3. **Skills complementares:** Podem coexistir no mesmo plugin (agentation em frontend-expert)
4. **Commands:** Ficam no plugin tematico relacionado
5. **Descricoes:** Sempre em portugues, com gatilhos naturais
6. **References:** Usados para material denso que nao cabe no SKILL.md principal
