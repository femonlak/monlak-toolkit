---
name: monlak-toolkit
description: >
  Especialista na estrutura e gestao do repositorio monlak-toolkit (marketplace de plugins Claude Code).
  Sabe a estrutura exata de plugins, skills, commands, agents e hooks.
  Usa esse conhecimento para adicionar qualquer componente novo no local correto.
  Use quando precisar criar, adicionar ou atualizar skills, plugins, slash commands, agents ou hooks no monlak-toolkit.
user-invocable: false
---

# monlak-toolkit - Especialista em Estrutura do Marketplace

Voce e o especialista que conhece cada detalhe do repositorio `femonlak/monlak-toolkit`. Use esse conhecimento para adicionar qualquer componente novo no local correto, seguindo todos os padroes existentes.

## Repositorio

- **URL:** https://github.com/femonlak/monlak-toolkit.git
- **Local clone:** `~/monlak-toolkit` (clonar se nao existir)
- **Branch padrao:** `main`

## Arquitetura do Marketplace

O marketplace e definido por `.claude-plugin/marketplace.json` na raiz. Cada plugin e uma pasta independente no root do repo. A estrutura completa:

```
monlak-toolkit/
├── .claude-plugin/
│   └── marketplace.json          # Registro de todos os plugins
├── README.md                     # Documentacao do marketplace
├── global/
│   └── CLAUDE.md                 # Instrucoes globais
├── hooks/
│   └── hooks.json                # Referencia de hooks
│
├── [plugin-name]/                # Cada plugin no root
│   ├── .claude-plugin/
│   │   └── plugin.json           # Manifesto obrigatorio
│   ├── skills/
│   │   └── [skill-name]/
│   │       ├── SKILL.md          # Definicao da skill
│   │       └── references/       # Docs de apoio (lazy-loaded)
│   ├── commands/
│   │   └── [command].md          # Slash commands
│   ├── agents/
│   │   └── [agent].md            # Agentes customizados
│   ├── .mcp.json                 # Config MCP (opcional)
│   └── hooks/
│       └── hooks.json            # Hooks (opcional)
```

## Plugins Existentes

| Plugin | Skills | Commands | Descricao |
|--------|--------|----------|-----------|
| deploy-vercel | deploy | /git-sync | Deploy Vercel com auto-recovery |
| new-feature | workflow | /fix, /enhance-feature | Desenvolvimento de features |
| toolkit-meta | monlak-toolkit | /monlak-toolkit | Gestao do proprio toolkit |
| consulting | consulting | - | Frameworks de consultoria |
| supabase-expert | supabase-expert | - | Especialista Supabase |
| frontend-expert | frontend-expert, agentation | - | Frontend React/RN |
| kickstart | kickstart | - | Inicializacao de projetos |
| last30days | last30days | - | Pesquisa ultimos 30 dias |
| bizdev | bizdev-helper | /ataque, /pipeline, /diagnostico, /update-pipeline | Business development |
| frontend-slides | frontend-slides | - | Apresentacoes HTML |

## Regras de Decisao: Onde Colocar Cada Componente

### Nova Skill
- **Sempre cria um plugin novo** (cada skill = um plugin standalone)
- Excecao: se a skill complementa um plugin existente (como `agentation` em `frontend-expert`), adicionar como skill extra no plugin existente
- Path: `[plugin-name]/skills/[skill-name]/SKILL.md`

### Novo Command
- **Adicionar ao plugin tematico mais relevante**
- Perguntar ao usuario se houver duvida
- Sugestoes automaticas:
  - Dev/debug/code → `new-feature`
  - Git/deploy/CI → `deploy-vercel`
  - Gestao toolkit → `toolkit-meta`
  - Negocio/vendas → `bizdev`
  - Frontend/UI → `frontend-expert`
  - Outro → criar plugin novo ou perguntar
- Path: `[plugin-name]/commands/[command-name].md`

### Novo Agent
- Adicionar ao plugin mais relevante ou criar plugin novo
- Path: `[plugin-name]/agents/[agent-name].md`

### Novo Hook
- Adicionar ao plugin mais relevante
- Path: `[plugin-name]/hooks/hooks.json`

### Novo Plugin Completo
- Criar pasta no root do repo com toda a estrutura

## Templates Obrigatorios

### Template: plugin.json
```json
{
  "name": "[plugin-name]",
  "description": "[descricao curta em portugues]",
  "version": "1.0.0"
}
```

### Template: SKILL.md
```yaml
---
name: [skill-name]
description: >
  [Descricao rica com keywords e gatilhos naturais.
  Maximo 200 caracteres recomendado.
  Incluir quando usar e frases de gatilho.]
---

# [Titulo da Skill]

[Instrucoes detalhadas em Markdown]
```

Campos opcionais do frontmatter:
- `argument-hint:` - dica para autocomplete (ex: `[issue-number]`)
- `disable-model-invocation: true` - so ativa por slash command
- `user-invocable: false` - nao aparece no menu /
- `context: fork` - roda em subagent isolado
- `agent: Explore` - tipo de subagent
- `allowed-tools:` - restringe ferramentas
- `model:` - override de modelo

### Template: Command (.md)
```yaml
---
description: [o que o comando faz]
argument-hint: [dica do argumento] # opcional
allowed-tools: Tool1, Tool2       # opcional
model: claude-opus-4-1            # opcional
---

## Start here:

[Instrucoes do comando]

$ARGUMENTS

[Workflow detalhado]
```

### Template: marketplace.json entry
```json
{
  "name": "[plugin-name]",
  "source": "./[plugin-name]",
  "description": "[descricao curta]"
}
```

### Template: README.md entries

**Skill:**
```markdown
| [nome] | [descricao] | [gatilhos naturais em portugues] |
```

**Command:**
```markdown
| /[nome] | [plugin] | [descricao] |
```

**Instalacao (adicionar se plugin novo):**
```markdown
/plugin install [plugin-name]@femonlak-monlak-toolkit
```

## Versionamento

- Plugin novo: `1.0.0`
- Nova funcionalidade (minor): `x.Y.0`
- Bug fix (patch): `x.y.Z`
- Mudanca breaking (major): `X.0.0`

## Processo Padrao de Adicao

### 1. Setup
```bash
if [ -d ~/monlak-toolkit ]; then
  cd ~/monlak-toolkit && git pull origin main
else
  cd ~ && git clone https://github.com/femonlak/monlak-toolkit.git && cd monlak-toolkit
fi
git checkout -b add-[nome]-$(date +%Y%m%d)
```

### 2. Criar Estrutura
Criar pastas e arquivos seguindo os templates acima.

### 3. Atualizar Metadados
- Criar/atualizar `[plugin]/.claude-plugin/plugin.json`
- Adicionar ao `.claude-plugin/marketplace.json` (se plugin novo)

### 4. Atualizar README.md
- Adicionar skill na tabela `## Skills` (se skill)
- Adicionar command na tabela `## Slash Commands` (se command)
- Adicionar plugin no bloco de instalacao (se plugin novo)
- Atualizar arvore de `## Estrutura`

### 5. Commit e Push
```bash
git add .
git commit -m "feat: add [tipo] [nome]"
git push origin add-[nome]-$(date +%Y%m%d)
```

### 6. Confirmacao
Apresentar resumo e link para criar PR.

## Detalhes de Referencia

Para especificacoes detalhadas, consultar:
- `references/repo-map.md` - Mapa completo de cada arquivo no repo
- `references/skill-spec.md` - Especificacao completa de Skills (Agent Skills Standard)
- `references/examples.md` - Exemplos reais de skills e commands existentes

## Regras Importantes

- Sempre confirmar com o usuario antes de executar mudancas
- Sempre atualizar o README.md do marketplace
- Nunca sobrescrever sem mostrar diff primeiro
- Manter descricoes em portugues
- Usar kebab-case para nomes de plugins/skills/commands
- Skills devem ter descricoes ricas com keywords para ativacao automatica
- Commands com side effects devem usar `disable-model-invocation: true`
- Seguir exatamente os padroes dos plugins existentes
