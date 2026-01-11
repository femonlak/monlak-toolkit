---
description: adicionar ou atualizar arquivo no plugin monlak-toolkit
argument-hint: [caminho-do-arquivo]
model: claude-opus-4-1
allowed-tools: Bash(git:*), Bash(curl:*), Bash(cat:*), Bash(ls:*), Bash(mkdir:*), Bash(cp:*), Bash(mv:*), Bash(rm:*)
---

## Start here

O argumento do comando será o caminho completo para o arquivo que você quer adicionar ou atualizar no plugin monlak-toolkit.

**User input:**
$ARGUMENTS

## CONTEXTO

Você é um especialista em gerenciar plugins do Claude Code e vai adicionar ou atualizar arquivos no repositório GitHub `femonlak/monlak-toolkit`.

### Estrutura do repositório monlak-toolkit

```
monlak-toolkit/
├── .claude-plugin/
│   └── marketplace.json
├── [plugin-name]/              # Cada plugin é uma pasta no root
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── SKILL.md               # Se for skill
│   ├── commands/              # Se tiver commands
│   │   └── *.md
│   ├── agents/                # Se tiver agents
│   │   └── *.md
│   ├── hooks/                 # Se tiver hooks
│   │   └── hooks.json
│   └── references/            # Opcional para skills
└── README.md
```

**Plugins existentes:**
- `deploy-vercel/` - Skill de deploy
- `new-feature/` - Skill de feature development
- `my-commands/` - Todos os commands (destino padrão)

### Tipos de componentes suportados

1. **Skills**: Pasta com SKILL.md (pode ter references/)
2. **Commands**: Arquivos .md em `commands/`
3. **Agents**: Arquivos .md em `agents/`
4. **Hooks**: arquivo hooks.json

## PROCESSO

### Fase 1: Análise do Arquivo

1. **Baixar/ler o arquivo** do caminho fornecido
2. **Identificar o tipo** baseado em:
   - Se for pasta com SKILL.md → Skill
   - Se for arquivo .md com frontmatter de command → Command
   - Se for arquivo .md com definição de agent → Agent
   - Se for hooks.json → Hook
3. **Extrair informações**:
   - Nome (derivado do filename ou do frontmatter)
   - Descrição
   - Dependências/configurações especiais
4. **Confirmar com usuário**:

Analisei o arquivo. Aqui está o que encontrei:

**Tipo:** [Skill/Command/Agent/Hook]
**Nome:** [nome-identificado]
**Descrição:** [descrição-do-componente]

Este componente será adicionado como plugin [**novo**/**atualização do existente**] no monlak-toolkit.

**Ações que serão feitas:**
- [Skills] Criar novo plugin `nome-da-skill` OU atualizar existente
- [Commands] Adicionar em `my-commands/commands/` (ou plugin especificado por você)
- [Agents] Adicionar em plugin especificado por você
- [Hooks] Adicionar em plugin especificado por você
- Copiar arquivos para a estrutura correta
- Criar/atualizar `.claude-plugin/plugin.json` do plugin
- Adicionar entrada no `.claude-plugin/marketplace.json` (se plugin novo)
- Atualizar README.md com informações do componente

**[Se for Command]** Qual plugin usar? (deixe em branco para `my-commands`)
**[Se for Agent]** Qual plugin usar? (nome do plugin ou deixe em branco para criar novo)
**[Se for Hook]** Qual plugin usar? (nome do plugin ou deixe em branco para criar novo)

Confirma que posso prosseguir?

**IMPORTANTE:** Aguarde confirmação explícita antes de prosseguir.

### Fase 2: Setup do Repositório

Após confirmação:

1. **Verificar se repositório já está clonado**:
   ```bash
   if [ -d ~/monlak-toolkit ]; then
     cd ~/monlak-toolkit
     git pull origin main
   else
     cd ~
     git clone https://github.com/femonlak/monlak-toolkit.git
     cd monlak-toolkit
   fi
   ```

2. **Criar branch para a mudança**:
   ```bash
   git checkout -b add-[nome-do-componente]-$(date +%Y%m%d)
   ```

### Fase 3: Organizar Estrutura do Plugin

Baseado no tipo identificado:

#### Para Skills:
```bash
# Criar estrutura do plugin (nome do plugin = nome da skill)
mkdir -p [plugin-name]/.claude-plugin
mkdir -p [plugin-name]/references  # se houver

# Copiar arquivo(s)
cp [caminho-origem]/SKILL.md [plugin-name]/
cp -r [caminho-origem]/references/* [plugin-name]/references/  # se houver

# Nota: Skills são plugins standalone, cada skill = um plugin
```

#### Para Commands:
```bash
# Commands vão SEMPRE para o plugin my-commands (padrão)
# A não ser que o usuário especifique outro plugin

# Perguntar ao usuário na confirmação:
# "Este command será adicionado em my-commands. 
#  Quer usar outro plugin? (deixe em branco para my-commands)"

mkdir -p my-commands/.claude-plugin
mkdir -p my-commands/commands

# Copiar comando
cp [caminho-origem] my-commands/commands/[nome].md

# Nota: Se usuário especificar plugin diferente, 
# usar: [plugin-especificado]/commands/[nome].md
```

#### Para Agents:
```bash
# Perguntar ao usuário qual plugin usar na fase de confirmação

mkdir -p [plugin-name]/.claude-plugin
mkdir -p [plugin-name]/agents

# Copiar agent
cp [caminho-origem] [plugin-name]/agents/[nome].md
```

#### Para Hooks:
```bash
# Perguntar ao usuário qual plugin usar na fase de confirmação

mkdir -p [plugin-name]/.claude-plugin
mkdir -p [plugin-name]/hooks

# Copiar hook
cp [caminho-origem] [plugin-name]/hooks/hooks.json
```

### Fase 4: Criar/Atualizar Metadados do Plugin

**Nome do plugin baseado no tipo:**
- Skills: nome da skill (ex: `kickstart` para kickstart.skill)
- Commands: `my-commands` (padrão) ou plugin especificado pelo usuário
- Agents: plugin especificado pelo usuário
- Hooks: plugin especificado pelo usuário

Criar ou atualizar `[plugin-name]/.claude-plugin/plugin.json`:

```json
{
  "name": "[plugin-name]",
  "version": "[1.0.0 se novo, incrementar se atualização]",
  "description": "[descrição-extraída]",
  "author": {
    "name": "Monlak"
  }
}
```

### Fase 5: Atualizar Marketplace.json

Ler `.claude-plugin/marketplace.json` e:

**Se plugin é novo:**
- Adicionar entrada no array `plugins`:
```json
{
  "name": "[plugin-name]",
  "description": "[descrição]",
  "source": "./[plugin-name]"
}
```

**Se plugin já existe:**
- Atualizar descrição se mudou
- Incrementar versão se especificada

### Fase 6: Atualizar README.md

**Identificar seção correta:**
- Skills → tabela em `## Skills`
- Commands → tabela em `## Slash Commands`
- Agents → criar seção `## Agents` se não existir

**Adicionar ou atualizar entrada:**

Para Skills:
```markdown
| [nome] | [descrição] | [gatilhos] |
```

Para Commands:
```markdown
| /[comando] | [descrição] |
```

### Fase 7: Commit e Push

```bash
# Adicionar mudanças
git add .

# Commit
git commit -m "feat: add/update [nome-componente] [tipo]"

# Push
git push origin add-[nome-do-componente]-$(date +%Y%m%d)
```

### Fase 8: Confirmação Final

Apresentar ao usuário:

✅ Plugin [adicionado/atualizado] com sucesso!

**Mudanças realizadas:**
- [X] Arquivos copiados para `[plugin-name]/`
- [X] Criado/atualizado `plugin.json`
- [X] Atualizado `marketplace.json`
- [X] Atualizado `README.md`
- [X] Commit criado
- [X] Push para branch `add-[nome-do-componente]-$(date +%Y%m%d)`

**Próximos passos:**
1. Acesse https://github.com/femonlak/monlak-toolkit/pulls
2. Crie um Pull Request da branch `add-[nome-do-componente]-$(date +%Y%m%d)` para `main`
3. Revise as mudanças e faça merge

**Para testar localmente:**
```
/plugin marketplace add https://github.com/femonlak/monlak-toolkit.git
/plugin install [plugin-name]@femonlak-monlak-toolkit
```

## DETECÇÃO DE TIPO DE ARQUIVO

### Skills
**Indicadores:**
- Arquivo chamado `SKILL.md`
- OU pasta contendo `SKILL.md`
- OU frontmatter com `type: skill`
- OU conteúdo com seções típicas de skill: `## Overview`, `## When to use`, `## Process`

### Commands
**Indicadores:**
- Arquivo .md com frontmatter contendo `description:` e opcionalmente `argument-hint:`
- OU arquivo .md em pasta `commands/`
- OU conteúdo estruturado como instrução de comando

### Agents
**Indicadores:**
- Arquivo .md com definição de agent
- OU arquivo em pasta `agents/`
- OU frontmatter com `type: agent`

### Hooks
**Indicadores:**
- Arquivo chamado `hooks.json`
- OU JSON com estrutura de hooks do Claude Code

## REGRAS DE VERSIONAMENTO

**Para plugin novo:** `1.0.0`

**Para atualização:**
- Mudança breaking (estrutura diferente): incrementar major (2.0.0)
- Nova funcionalidade: incrementar minor (1.1.0)
- Bug fix ou melhoria: incrementar patch (1.0.1)

## TRATAMENTO DE CONFLITOS

Se plugin já existe e conteúdo é diferente:
1. Fazer backup do arquivo existente
2. Mostrar diff das mudanças ao usuário
3. Confirmar se quer sobrescrever
4. Se sim, incrementar versão apropriadamente

## ERROS COMUNS E SOLUÇÕES

### Arquivo não encontrado
```
Erro: Não consegui acessar o arquivo em [caminho]

Possíveis soluções:
- Verifique se o caminho está correto
- Verifique permissões do arquivo
- Tente copiar o arquivo para /tmp primeiro
```

### Git push falha
```
Erro: Falha ao fazer push para o GitHub

Verifique:
- Suas credenciais do GitHub estão configuradas?
- Você tem permissões de escrita no repositório?
- O remote origin está correto?

Comandos úteis:
git remote -v
git config --list | grep user
```

### JSON inválido
```
Erro: Falha ao parsear marketplace.json

O arquivo pode estar corrompido. Você quer que eu:
1. Restaure do último commit válido
2. Recrie o arquivo do zero
```

## EXEMPLOS DE USO

### Exemplo 1: Adicionar nova skill
```
/monlak-toolkit /Users/monlak/Downloads/kickstart.skill

→ Analisa a pasta
→ Identifica como Skill
→ Confirma com usuário
→ Cria plugin "kickstart" em monlak-toolkit/kickstart/
→ Atualiza todos metadados
→ Commit e push
```

### Exemplo 2: Atualizar comando existente
```
/monlak-toolkit /Users/monlak/Downloads/fix-improved.md

→ Analisa o arquivo
→ Identifica como Command chamado "fix"
→ Verifica que "fix" já existe em my-commands/commands/
→ Mostra diff das mudanças
→ Confirma com usuário se quer atualizar
→ Atualiza arquivo em my-commands/commands/fix.md
→ Incrementa versão do plugin my-commands
→ Commit e push
```

## NUNCA FAZER

- Nunca fazer push sem confirmação do usuário
- Nunca sobrescrever arquivos sem mostrar diff
- Nunca modificar arquivos que não sejam relacionados ao componente sendo adicionado
- Nunca usar linguagem técnica ao apresentar mudanças ao usuário
- Nunca assumir permissões do GitHub - sempre verificar antes de push
