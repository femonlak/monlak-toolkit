# Mapa Completo do Repositorio monlak-toolkit

## Arquivos na Raiz

| Arquivo | Funcao |
|---------|--------|
| `.claude-plugin/marketplace.json` | Registro central de todos os plugins |
| `README.md` | Documentacao publica do marketplace |
| `global/CLAUDE.md` | Instrucoes globais de comportamento |
| `hooks/hooks.json` | Referencia de hooks de notificacao |

## Formato do marketplace.json

```json
{
  "name": "monlak-toolkit",
  "owner": {
    "name": "Felipe Monlak"
  },
  "plugins": [
    {
      "name": "[plugin-name]",
      "source": "./[plugin-name]",
      "description": "[descricao curta]"
    }
  ]
}
```

O array `plugins` lista todos os plugins publicos. Cada entrada precisa de `name`, `source` (path relativo com `./`) e `description`.

## Formato do plugin.json

Cada plugin tem `.claude-plugin/plugin.json`:

```json
{
  "name": "[plugin-name]",
  "description": "[descricao]",
  "version": "[semver]"
}
```

Campos opcionais: `author: { "name": "..." }`, `keywords: [...]`, `skills: [...]`.

## Formato do README.md

O README tem estas secoes em ordem:

1. `# monlak-toolkit` - titulo
2. `## Instalacao` - comando de marketplace + lista de install por plugin
3. `## Skills` - tabela com colunas: Nome, Descricao, Gatilhos
4. `## Slash Commands` - tabela com colunas: Comando, Plugin, Descricao
5. `## Extras` - CLAUDE.md global e hooks
6. `## Estrutura` - arvore ASCII completa do repo

### Ao adicionar componente, atualizar:

**Novo plugin:**
- Adicionar linha de install em `## Instalacao`
- Adicionar skill na tabela `## Skills` (se tiver skill)
- Adicionar commands na tabela `## Slash Commands` (se tiver commands)
- Adicionar pasta na arvore `## Estrutura`

**Novo command em plugin existente:**
- Adicionar na tabela `## Slash Commands`
- Atualizar arvore `## Estrutura`
- Incrementar versao do plugin

**Nova skill em plugin existente:**
- Atualizar descricao na tabela `## Skills`
- Atualizar arvore `## Estrutura`
- Incrementar versao do plugin

## Mapa de Plugins Detalhado

### deploy-vercel (v1.1.0)
```
deploy-vercel/
├── .claude-plugin/plugin.json
├── skills/deploy/SKILL.md
└── commands/git-sync.md
```

### new-feature (v?.?.?)
```
new-feature/
├── .claude-plugin/plugin.json
├── skills/workflow/
│   ├── SKILL.md
│   └── references/
└── commands/
    ├── fix.md
    └── enhance-feature.md
```

### toolkit-meta (v3.0.0)
```
toolkit-meta/
├── .claude-plugin/plugin.json
├── skills/monlak-toolkit/
│   ├── SKILL.md
│   └── references/
│       ├── repo-map.md
│       ├── skill-spec.md
│       └── examples.md
└── commands/
    └── monlak-toolkit.md
```

### consulting
```
consulting/
├── .claude-plugin/plugin.json
└── skills/consulting/
    ├── SKILL.md
    ├── references/
    └── assets/templates/
```

### supabase-expert
```
supabase-expert/
├── .claude-plugin/plugin.json
└── skills/supabase-expert/
    ├── SKILL.md
    └── references/
```

### frontend-expert
```
frontend-expert/
├── .claude-plugin/plugin.json
└── skills/
    ├── frontend-expert/
    │   ├── SKILL.md
    │   └── references/
    └── agentation/
        └── SKILL.md
```

### kickstart
```
kickstart/
├── .claude-plugin/plugin.json
├── SKILL.md
└── references/
```

### last30days
```
last30days/
├── .claude-plugin/plugin.json
└── skills/last30days/
    ├── SKILL.md
    ├── scripts/
    └── fixtures/
```

### bizdev
```
bizdev/
├── .claude-plugin/plugin.json
├── .mcp.json
├── skills/bizdev-helper/
│   ├── SKILL.md
│   └── references/
└── commands/
    ├── ataque.md
    ├── diagnostico.md
    ├── pipeline.md
    └── update-pipeline.md
```

### frontend-slides
```
frontend-slides/
├── .claude-plugin/plugin.json
└── skills/frontend-slides/
    ├── SKILL.md
    └── references/
```
