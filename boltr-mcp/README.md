# BOLTR Tasks MCP Server

MCP server que expõe todas as funcionalidades do BOLTR Tasks para agentes de IA. Permite gerenciar tasks, lists, goals, focus sessions e sprints diretamente via conversa com IA.

**25 tools** organizados em 7 módulos:

| Módulo | Tools | Descrição |
|--------|-------|-----------|
| Tasks | 7 | CRUD + complete + flags (MIT/Delay/Doing) |
| Subtasks | 4 | CRUD completo |
| Lists | 4 | CRUD com agrupamento por area |
| Goals | 4 | CRUD + milestones + progresso |
| Recurrence | 2 | Criar/remover recorrência |
| Focus & Sprints | 3 | Focus session + Sprint CRUD + Timer |
| Dashboard | 1 | Snapshot completo do estado |

---

## Pré-requisitos

- **Node.js** >= 18
- **Conta BOLTR** com email e senha

---

## Instalação

### 1. Clonar e buildar o MCP server

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/femonlak/monlak-toolkit.git
cd monlak-toolkit/boltr-mcp/mcp-server

# Instalar dependências
npm install

# Buildar
npm run build
```

O build gera os arquivos em `dist/`. Anote o caminho absoluto do `dist/index.js` — você vai precisar dele para configurar.

```bash
# Para pegar o caminho absoluto:
echo "$(pwd)/dist/index.js"
```

---

### 2. Configuração no Claude Code

#### Opção A: Via comando (recomendado)

```bash
claude mcp add boltr \
  --transport stdio \
  --scope user \
  --env BOLTR_EMAIL=seu-email@exemplo.com \
  --env BOLTR_PASSWORD=sua-senha \
  -- node /CAMINHO/ABSOLUTO/monlak-toolkit/boltr-mcp/mcp-server/dist/index.js
```

> Substitua `/CAMINHO/ABSOLUTO/` pelo caminho real no seu sistema.

#### Opção B: Via arquivo `.mcp.json` no projeto

Crie ou edite `.mcp.json` na raiz do seu projeto:

```json
{
  "mcpServers": {
    "boltr": {
      "type": "stdio",
      "command": "node",
      "args": ["/CAMINHO/ABSOLUTO/monlak-toolkit/boltr-mcp/mcp-server/dist/index.js"],
      "env": {
        "BOLTR_EMAIL": "seu-email@exemplo.com",
        "BOLTR_PASSWORD": "sua-senha"
      }
    }
  }
}
```

#### Opção C: Via variáveis de ambiente (mais seguro)

Para não deixar a senha em texto no config, use variáveis de ambiente do shell:

```bash
# Adicione ao seu ~/.zshrc ou ~/.bashrc:
export BOLTR_EMAIL="seu-email@exemplo.com"
export BOLTR_PASSWORD="sua-senha"
```

E no `.mcp.json`:

```json
{
  "mcpServers": {
    "boltr": {
      "type": "stdio",
      "command": "node",
      "args": ["/CAMINHO/ABSOLUTO/monlak-toolkit/boltr-mcp/mcp-server/dist/index.js"],
      "env": {
        "BOLTR_EMAIL": "${BOLTR_EMAIL}",
        "BOLTR_PASSWORD": "${BOLTR_PASSWORD}"
      }
    }
  }
}
```

**Verificar conexão:**

Dentro do Claude Code, rode `/mcp` para ver se o server `boltr` aparece como conectado.

---

### 3. Configuração no Claude Desktop / Claude Co-Work

Edite o arquivo de configuração do Claude Desktop:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Adicione o BOLTR server na seção `mcpServers`:

```json
{
  "mcpServers": {
    "boltr": {
      "command": "node",
      "args": ["/CAMINHO/ABSOLUTO/monlak-toolkit/boltr-mcp/mcp-server/dist/index.js"],
      "env": {
        "BOLTR_EMAIL": "seu-email@exemplo.com",
        "BOLTR_PASSWORD": "sua-senha"
      }
    }
  }
}
```

> Se já existem outros servers configurados, adicione `"boltr": {...}` dentro do objeto `mcpServers` existente.

**Reinicie o Claude Desktop** após salvar.

**Verificar conexão:**

Clique no botão `+` na caixa de chat e selecione "Connectors". O BOLTR deve aparecer na lista de MCP servers conectados.

---

### 4. Configuração no Claude AI (claude.ai)

O Claude AI (web) suporta MCP servers remotos. Como o BOLTR MCP é um servidor local (stdio), existem duas opções:

#### Opção A: Usar via Claude Desktop (recomendado)

Configure no Claude Desktop conforme a seção anterior. Os MCP servers configurados no Desktop ficam automaticamente disponíveis no Claude.ai quando a flag `ENABLE_CLAUDEAI_MCP_SERVERS` está ativa.

#### Opção B: Hospedar como servidor remoto

Para usar diretamente no claude.ai sem o Desktop, seria necessário hospedar o MCP server como um serviço HTTP. Isso é um setup mais avançado:

1. Wrape o server com um adaptador HTTP (ex: `mcp-remote` ou `supergateway`)
2. Deploy em um servidor (VPS, cloud function, etc.)
3. Configure em [claude.ai/settings/connectors](https://claude.ai/settings/connectors)

> A opção A (via Claude Desktop) é muito mais simples para uso pessoal.

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `BOLTR_EMAIL` | Sim | Email da sua conta BOLTR |
| `BOLTR_PASSWORD` | Sim | Senha da sua conta BOLTR |

A autenticação funciona da seguinte forma:
1. Na primeira execução, faz login com email/senha
2. Armazena o refresh token em `~/.boltr-mcp/session.json`
3. Nas execuções seguintes, restaura a sessão automaticamente
4. Se o token expirar, faz login novamente com as credenciais

---

## Tools Disponíveis

### Tasks (7)
- `boltr_list_tasks` — Listar tasks por view (inbox/today/week/next/logbook) ou list
- `boltr_get_task` — Detalhe de uma task com subtasks e recorrência
- `boltr_create_task` — Criar task (título max 50 chars)
- `boltr_update_task` — Atualizar campos da task
- `boltr_complete_task` — Completar/descompletar (gera próxima ocorrência se recorrente)
- `boltr_delete_task` — Deletar task
- `boltr_toggle_task_flags` — Toggle MIT, Delayed ou Doing

### Subtasks (4)
- `boltr_list_subtasks` — Listar subtasks de uma task
- `boltr_create_subtask` — Criar subtask
- `boltr_update_subtask` — Atualizar/completar subtask
- `boltr_delete_subtask` — Deletar subtask

### Lists (4)
- `boltr_list_lists` — Todas as listas agrupadas por Work/Personal
- `boltr_create_list` — Criar lista
- `boltr_update_list` — Atualizar lista
- `boltr_delete_list` — Deletar lista (cascade tasks)

### Goals (4)
- `boltr_list_goals` — Goals do ano com progresso calculado
- `boltr_create_goal` — Criar goal (binary/milestone/numeric)
- `boltr_update_goal` — Atualizar goal
- `boltr_manage_milestones` — CRUD de milestones

### Recurrence (2)
- `boltr_create_recurrence` — Criar regra de recorrência
- `boltr_delete_recurrence` — Remover recorrência

### Focus & Sprints (3)
- `boltr_focus_session` — Start/stop focus timer
- `boltr_manage_sprint` — CRUD completo de sprints
- `boltr_sprint_timer` — Start/pause timer do sprint

### Dashboard (1)
- `boltr_get_dashboard` — Snapshot: contagens, MITs, doing, sessions, sprints, goals

---

## Skill

O plugin inclui uma skill (`boltr-mcp`) que ensina ao agente de IA:

- **Metodologia BOLTR**: Brain Dump → Organize → Line-up → Take Action → Repeat
- **Regras de alocação**: Como tasks são distribuídas nas views
- **Gestão de flags**: MIT, Delay, Doing — quando e como usar
- **Workflows**: Planejamento matinal, captura rápida, sessão de foco, revisão semanal
- **Regras de negócio**: Limites, formatos, exclusão mútua de timers

A skill é ativada automaticamente quando o usuário pede para gerenciar tasks, lists, goals ou sessões de foco.
