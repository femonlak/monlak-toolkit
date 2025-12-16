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
/plugin install dev-commands@femonlak-monlak-toolkit
```

## Skills

| Nome | Descrição | Gatilhos |
| --- | --- | --- |
| deploy-vercel | Ciclo completo de deploy: commit, push, monitoramento Vercel, auto-fix (3x), PR e merge | "faz commit e deploy", "deploy tudo" |
| new-feature | Orquestra desenvolvimento de feature: Product → UX/UI → Data Model → Revisão → Implementação → Docs | "nova feature", "implementar feature" |

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
├── dev-commands/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── commands/
│       ├── fix.md
│       ├── git-sync.md
│       └── enhance-feature.md
├── global/
│   └── CLAUDE.md
├── hooks/
│   └── hooks.json
└── README.md
```
