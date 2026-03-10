# monlak-toolkit

Toolkit pessoal para Claude Code.

## Instalação
```
/plugin marketplace add https://github.com/femonlak/monlak-toolkit.git
```

Instalar plugins específicos:
```
/plugin install deploy-vercel@femonlak-monlak-toolkit
/plugin install new-feature@femonlak-monlak-toolkit
/plugin install toolkit-meta@femonlak-monlak-toolkit
/plugin install consulting@femonlak-monlak-toolkit
/plugin install supabase-expert@femonlak-monlak-toolkit
/plugin install frontend-expert@femonlak-monlak-toolkit
/plugin install kickstart@femonlak-monlak-toolkit
/plugin install last30days@femonlak-monlak-toolkit
/plugin install bizdev@femonlak-monlak-toolkit
/plugin install frontend-slides@femonlak-monlak-toolkit
/plugin install skynet-agent-builder@femonlak-monlak-toolkit
```

## Skills

| Nome | Descrição | Gatilhos |
| --- | --- | --- |
| deploy-vercel | Ciclo completo de deploy: commit, push, monitoramento Vercel, auto-fix (3x), PR e merge | "faz commit e deploy", "deploy tudo" |
| new-feature | Orquestra desenvolvimento de feature: Product → UX/UI → Data Model → Revisão → Implementação → Docs | "nova feature", "implementar feature" |
| consulting | Frameworks de consultoria (McKinsey, BCG, Bain, Accenture) para problem-solving e análise estratégica | "análise estratégica", "framework de consultoria", "SWOT", "Porter", "market sizing" |
| supabase-expert | Especialista Supabase: schema, migrations, RLS, realtime, Edge Functions e best practices | trabalho com database, backend, Supabase, migrations, RLS policies |
| frontend-expert | Frontend de alta qualidade: React, React Native, design systems, UX/UI, animações, cross-platform e visual feedback com Agentation | building UI components, React, React Native, design system, animações, mobile patterns, agentation |
| kickstart | Inicializar projetos com tech stack completo (web/mobile), Supabase, style guide, GitHub/Vercel/Expo e validação de tools | "kickstart this project", "iniciar projeto", "use kickstart skill" |
| last30days | Pesquisa tópicos no Reddit + X + Web dos últimos 30 dias, sintetiza insights e gera prompts copy-paste | "/last30days [tópico]", "pesquisar sobre X nos últimos 30 dias" |
| bizdev | Coach comercial: plano de ataque diário, diagnóstico de pipeline (score 0-100), visualização de funil e reporting | "plano de ataque", "como tá o pipeline?", "o que tá parado?" |
| frontend-slides | Criar apresentações HTML com animações a partir do zero ou convertendo PowerPoint, com 12 presets visuais | "create presentation", "convert pptx", "make slides", "/frontend-slides" |
| skynet-agent-builder | Criar e documentar agentes autônomos e skills para o Projeto Skynet com templates OpenClaw e gestão via Linear | "criar agente", "novo agente", "skynet", "documentar agente", "criar skill para agente" |

## Slash Commands

| Comando | Plugin | Descrição |
| --- | --- | --- |
| /fix | new-feature | Investigar e corrigir bugs com confirmação de entendimento e proposta de soluções |
| /enhance-feature | new-feature | Adicionar melhoria incremental em feature existente |
| /git-sync | deploy-vercel | Sincronizar repositório local com remoto, apresentando plano antes de executar |
| /monlak-toolkit | toolkit-meta | Adicionar ou atualizar componente no monlak-toolkit (skill, plugin, command, agent, hook) |
| /ataque | bizdev | Plano de ataque comercial do dia |
| /pipeline | bizdev | Visualização do funil por projeto |
| /diagnostico | bizdev | Diagnóstico de saúde do pipeline (score 0-100) |
| /update-pipeline | bizdev | Gerar project update para o Linear |

## Extras

### CLAUDE.md global

Instruções de comportamento para todos os projetos. Copie para `~/.claude/CLAUDE.md`.

### Hooks

Sons de notificação (Glass.aiff e Hero.aiff). Configure manualmente no `~/.claude/settings.json`. Referência em `hooks/hooks.json`.

## Estrutura
```
monlak-toolkit/
├── .claude-plugin/
│   └── marketplace.json
├── deploy-vercel/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── skills/
│   │   └── deploy/
│   │       └── SKILL.md
│   └── commands/
│       └── git-sync.md
├── new-feature/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── skills/
│   │   └── workflow/
│   │       ├── SKILL.md
│   │       └── references/
│   └── commands/
│       ├── fix.md
│       └── enhance-feature.md
├── toolkit-meta/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── skills/
│   │   └── monlak-toolkit/
│   │       ├── SKILL.md
│   │       └── references/
│   │           ├── repo-map.md
│   │           ├── skill-spec.md
│   │           └── examples.md
│   └── commands/
│       └── monlak-toolkit.md
├── consulting/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── consulting/
│           ├── SKILL.md
│           ├── references/
│           └── assets/templates/
├── supabase-expert/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── supabase-expert/
│           ├── SKILL.md
│           └── references/
├── frontend-expert/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       ├── frontend-expert/
│       │   ├── SKILL.md
│       │   └── references/
│       └── agentation/
│           └── SKILL.md
├── kickstart/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── SKILL.md
│   └── references/
│       ├── step1-tech-stack.md
│       ├── step2-stack-configuration.md
│       ├── step3-supabase-setup.md
│       ├── step4-style-guide.md
│       ├── step5-github-setup.md
│       ├── step6-vercel-deployment.md
│       ├── step7-expo-deployment.md
│       └── step8-tools-validation.md
├── last30days/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── last30days/
│           ├── SKILL.md
│           ├── scripts/
│           │   ├── last30days.py
│           │   └── lib/
│           └── fixtures/
├── bizdev/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── .mcp.json
│   ├── skills/
│   │   └── bizdev-helper/
│   │       ├── SKILL.md
│   │       └── references/
│   │           ├── pipeline-context.md
│   │           ├── pipeline-scoring.md
│   │           └── pipeline-update.md
│   └── commands/
│       ├── ataque.md
│       ├── diagnostico.md
│       ├── pipeline.md
│       └── update-pipeline.md
├── frontend-slides/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── frontend-slides/
│           ├── SKILL.md
│           └── references/
│               ├── STYLE_PRESETS.md
│               ├── viewport-base.css
│               ├── html-template.md
│               ├── animation-patterns.md
│               └── scripts/
│                   └── extract-pptx.py
├── skynet-agent-builder/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── skynet-agent-builder/
│           ├── SKILL.md
│           └── references/
│               ├── agent-template.md
│               ├── skill-template.md
│               └── skynet-agents.md
├── global/
│   └── CLAUDE.md
├── hooks/
│   └── hooks.json
└── README.md
```
