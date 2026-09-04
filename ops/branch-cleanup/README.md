# Faxina de branches

Toda sessão de trabalho (na nuvem ou no Mac) cria uma branch (uma cópia de trabalho do repo). O trabalho entra na `main` por PR (o pedido pra juntar a mudança) e, sem faxina, a branch fica pra sempre. A faxina vive aqui, dentro do próprio repo, pra não depender de máquina ligada.

## O que acontece sozinho

`sweep.sh` roda pelo GitHub Actions (`.github/workflows/branch-cleanup.yml`):

- quando um PR fecha (mergeado ou não);
- quando entra commit na `main`;
- toda segunda às 06:00 BRT;
- sob demanda (Actions > branch-cleanup > Run workflow). Com "dry run" marcado, só lista o que faria: não apaga e não mexe em issue.

Regras, na ordem em que o script decide por branch:

| Situação | Ação |
|----------|------|
| Tem PR aberto | mantém |
| Já está toda contida na `main` | apaga |
| Algum PR fechado (mergeado ou não) tem como último commit exatamente o commit atual da branch | apaga. Os commits ficam guardados no PR; o botão "Restore branch" na página do PR recria a branch |
| `develop`/`staging`/`release/*` com trabalho à frente | avisa: viola o trunk-based (uma branch de vida longa só) |
| Trabalho fora de qualquer PR, parado há 14+ dias | avisa |
| Trabalho fora de qualquer PR, ativo há menos de 14 dias | mantém |

Commit que não está guardado em nenhum PR nunca é apagado pela rotina. PR fechado sem merge é apagado porque o PR guarda tudo.

Antes de apagar, a rotina relê a branch: se entrou commit novo desde a listagem, ela fica pra próxima rodada. Sobra uma janela de menos de um segundo entre a releitura e a exclusão, porque o GitHub não oferece exclusão condicional. Erro do GitHub ao consultar, reler ou apagar uma branch mantém a branch e segue pras outras; erro ao listar as branches faz a rodada falhar inteira, em vez de fingir que não há nada.

## Como o aviso chega

Aviso vira uma issue no repo com o resumo da rodada. É uma só: a rotina atualiza a mesma issue a cada rodada, comenta nela quando entra ou sai branch da lista de avisos (editar o texto não notifica; comentário notifica) e fecha sozinha quando não sobra aviso. Quem acompanha o repo recebe a notificação da issue e dos comentários.

## Segunda camada

Neste repo, **Automatically delete head branches** está ligada (Settings > General > Pull Requests). O GitHub apaga a branch no merge mesmo se o Actions estiver fora. A rotina continua necessária pra PR fechado sem merge, branch esquecida e branch de vida longa.

## Testar na mão

No Mac, uma vez: `brew install gh jq` e `gh auth login`. Depois:

```
REPO=femonlak/monlak-toolkit DRY_RUN=1 bash ops/branch-cleanup/sweep.sh
```

Roda no bash do macOS e do Linux. Só lista. Sem `DRY_RUN=1` apaga de verdade e mexe em issue.

