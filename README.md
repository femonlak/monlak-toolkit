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
/plugin install my-commands@femonlak-monlak-toolkit
/plugin install consulting@femonlak-monlak-toolkit
/plugin install supabase-expert@femonlak-monlak-toolkit
/plugin install frontend-expert@femonlak-monlak-toolkit
/plugin install kickstart@femonlak-monlak-toolkit
/plugin install last30days@femonlak-monlak-toolkit
/plugin install agentation@femonlak-monlak-toolkit
```

## Skills

| Nome | Descrição | Gatilhos |
| --- | --- | --- |
| deploy-vercel | Ciclo completo de deploy: commit, push, monitoramento Vercel, auto-fix (3x), PR e merge | "faz commit e deploy", "deploy tudo" |
| new-feature | Orquestra desenvolvimento de feature: Product → UX/UI → Data Model → Revisão → Implementação → Docs | "nova feature", "implementar feature" |
| consulting | Frameworks de consultoria (McKinsey, BCG, Bain, Accenture) para problem-solving e análise estratégica | "análise estratégica", "framework de consultoria", "SWOT", "Porter", "market sizing" |
| supabase-expert | Especialista Supabase: schema, migrations, RLS, realtime, Edge Functions e best practices | trabalho com database, backend, Supabase, migrations, RLS policies |
| frontend-expert | Frontend de alta qualidade: React, React Native, design systems, UX/UI, animações e cross-platform | building UI components, React, React Native, design system, animações, mobile patterns |
| kickstart | Inicializar projetos com tech stack completo (web/mobile), Supabase, style guide, GitHub/Vercel/Expo e validação de tools | "kickstart this project", "iniciar projeto", "use kickstart skill" |
| last30days | Pesquisa tópicos no Reddit + X + Web dos últimos 30 dias, sintetiza insights e gera prompts copy-paste | "/last30days [tópico]", "pesquisar sobre X nos últimos 30 dias" |
| agentation | Ferramenta visual de feedback para AI agents - captura seletores CSS e posições de elementos | projetos web com React/Next.js para melhor assistência de AI agents |

## Slash Commands

| Comando | Descrição |
| --- | --- |
| /fix | Investigar e corrigir bugs com confirmação de entendimento e proposta de soluções |
| /git-sync | Sincronizar repositório local com remoto, apresentando plano antes de executar |
| /enhance-feature | Adicionar melhoria incremental em feature existente |

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
│   └── skills/
│       └── deploy/
│           └── SKILL.md
├── new-feature/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── workflow/
│           ├── SKILL.md
│           └── references/
├── my-commands/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── commands/
│       ├── fix.md
│       ├── git-sync.md
│       ├── enhance-feature.md
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
│       └── frontend-expert/
│           ├── SKILL.md
│           └── references/
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
├── agentation/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── agentation/
│           └── SKILL.md
├── global/
│   └── CLAUDE.md
├── hooks/
│   └── hooks.json
└── README.md
```
