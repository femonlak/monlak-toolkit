# Especificacao de Skills - Agent Skills Standard

## Formato SKILL.md

Cada skill e um arquivo `SKILL.md` com frontmatter YAML + corpo Markdown.

### Frontmatter Obrigatorio

```yaml
---
name: [nome-kebab-case]
description: >
  [Descricao rica com keywords e gatilhos naturais.
  200 caracteres recomendado, maximo 1024.]
---
```

### Frontmatter Opcional

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `argument-hint` | string | Dica para autocomplete (ex: `[topic]`) |
| `disable-model-invocation` | boolean | `true` = so ativa por / command |
| `user-invocable` | boolean | `false` = nao aparece no menu / |
| `context` | string | `fork` = roda em subagent isolado |
| `agent` | string | Tipo de subagent: `Explore`, `Plan`, `general-purpose` |
| `allowed-tools` | string | Lista de tools separadas por virgula |
| `model` | string | Override de modelo (ex: `claude-opus-4-1`) |

### Regras do Campo `name`

- 1-64 caracteres
- So lowercase alfanumerico e hifens (`a-z`, `0-9`, `-`)
- Nao pode comecar ou terminar com `-`
- Nao pode ter hifens consecutivos (`--`)
- Deve corresponder ao nome da pasta pai

### Corpo do SKILL.md

Estrutura recomendada:

1. `# Titulo` - nome da skill
2. Descricao expandida de quando usar
3. `## Processo` / `## Workflow` - passos detalhados
4. `## Referencias` - links para arquivos em `references/`
5. `## Regras` - o que fazer e nao fazer

### Boas Praticas

- Manter SKILL.md abaixo de 500 linhas
- Mover material denso para `references/`
- Usar forma imperativa ("Execute os testes" nao "Os testes devem ser executados")
- Descricoes ricas com keywords para ativacao automatica
- Incluir exemplos de input/output
- Referenciar arquivos de apoio explicitamente

## Formato de Commands (.md)

Slash commands sao arquivos `.md` em `commands/` com frontmatter:

```yaml
---
description: [descricao curta]
argument-hint: [dica] # opcional
allowed-tools: Tool1, Tool2 # opcional
model: claude-opus-4-1 # opcional
---
```

### Variaveis Disponiveis

| Variavel | Descricao |
|----------|-----------|
| `$ARGUMENTS` | Todos os argumentos passados |
| `$ARGUMENTS[N]` | Argumento especifico (0-indexed) |
| `$N` | Atalho para `$ARGUMENTS[N]` |
| `${CLAUDE_SESSION_ID}` | ID da sessao atual |
| `${CLAUDE_SKILL_DIR}` | Diretorio da skill |
| `${CLAUDE_PLUGIN_ROOT}` | Raiz do plugin |

### Contexto Dinamico

Usar `` !`command` `` para injetar output de comandos:

```markdown
## Contexto
- Branch atual: !`git branch --show-current`
- Status: !`git status --short`
```

### allowed-tools com Patterns

```yaml
# So comandos git
allowed-tools: Bash(git:*)

# So ferramentas do Linear MCP
allowed-tools: mcp__*linear*__*

# Combinacao
allowed-tools: Read, Write, Bash(git:*), Bash(npm:*)
```

## Estrutura de Diretorios

```
skill-name/
├── SKILL.md           # Instrucoes (obrigatorio)
├── references/        # Docs de apoio (opcional)
│   └── *.md
├── scripts/           # Scripts auxiliares (opcional)
│   └── *.py / *.sh
├── assets/            # Recursos estaticos (opcional)
│   └── templates/
└── fixtures/          # Dados de teste (opcional)
```

## Disclosure Progressivo

1. **Level 1 - Metadata** (~100 tokens): `name` e `description` sempre carregados
2. **Level 2 - SKILL.md body** (< 5000 tokens): Carregado quando skill ativa
3. **Level 3 - References** (ilimitado): Carregado sob demanda quando necessario
