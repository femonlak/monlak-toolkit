---
description: adicionar ou atualizar componente no monlak-toolkit (skill, plugin, command, agent, hook)
argument-hint: [instrucao - ex: "adicione skill para code review", "atualize a skill consulting"]
model: claude-opus-4-1
allowed-tools: Bash(git:*), Bash(curl:*), Bash(cat:*), Bash(ls:*), Bash(mkdir:*), Bash(cp:*), Bash(mv:*), Bash(rm:*), Read, Write, Edit, Glob, Grep, AskUserQuestion
---

## Start here

Voce recebeu uma instrucao para adicionar ou atualizar algo no monlak-toolkit.

**Instrucao do usuario:**
$ARGUMENTS

## O que fazer

Use TODO o conhecimento da skill `monlak-toolkit` (que voce ja tem carregada como background) para executar essa instrucao. A skill contem:

- Estrutura exata do repositorio e de cada plugin
- Templates obrigatorios (plugin.json, SKILL.md, commands, marketplace.json)
- Regras de decisao de onde colocar cada tipo de componente
- Processo padrao de adicao (setup repo, criar conteudo, metadados, README, commit)
- Referencias detalhadas em `references/` (repo-map, skill-spec, examples)

## Fluxo

1. **Entenda** o que o usuario quer (tipo, nome, destino)
2. **Confirme** o plano antes de executar
3. **Execute** seguindo o processo padrao da skill
4. **Atualize** TODOS os metadados (plugin.json, marketplace.json, README.md)
5. **Commit e push** para branch nova
6. **Apresente** resumo com link para PR

## Regra de ouro

Nunca executar sem confirmacao. Nunca esquecer o README.md.
