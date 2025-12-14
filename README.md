# monlak-toolkit

Toolkit pessoal para Claude Code.

## Instalação
```bash
/plugin marketplace add monlak/monlak-toolkit
/plugin install deploy-vercel@monlak-toolkit
```

## Skills

| Nome | Descrição |
|------|-----------|
| deploy-vercel | Automatiza commit, push e deploy na Vercel com monitoramento, correção automática de erros, criação de PR e merge |

## Extras

### CLAUDE.md global

Instruções de comportamento que se aplicam a todos os projetos. Copie para `~/.claude/CLAUDE.md` para ativar globalmente.

Localização: `global/CLAUDE.md`

### Hooks

Sons de notificação para feedback auditivo durante o uso do Claude Code. Hooks precisam ser configurados manualmente no `~/.claude/settings.json`.

Referência: `hooks/hooks.json`

## Estrutura
```
monlak-toolkit/
├── .claude-plugin/
│   └── marketplace.json
├── deploy-vercel/
│   └── SKILL.md
├── global/
│   └── CLAUDE.md
├── hooks/
│   └── hooks.json
└── README.md
```
