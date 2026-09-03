#!/usr/bin/env bash
# Faxina de branches do repo. Regras, gatilhos e uso: ops/branch-cleanup/README.md
# Precisa de gh (autenticado) e jq. DRY_RUN=1 so lista, nunca apaga nem mexe em issue.
# Uso local: REPO=owner/repo DRY_RUN=1 bash ops/branch-cleanup/sweep.sh
set -euo pipefail

REPO="${REPO:-${GITHUB_REPOSITORY:-}}"
[ -n "$REPO" ] || { echo "defina REPO=owner/repo" >&2; exit 2; }
OWNER="${REPO%%/*}"
STALE_DAYS="${STALE_DAYS:-14}"
DRY_RUN="${DRY_RUN:-0}"
ISSUE_TITLE="Faxina de branches: branch(es) esperando decisão"

api() { gh api "$@"; }
enc() { jq -rn --arg s "$1" '$s | split("/") | map(@uri) | join("/")'; }   # codifica tudo menos a barra
errfile="$(mktemp)"; trap 'rm -f "$errfile"' EXIT

default_branch="$(api "repos/$REPO" --jq .default_branch)"
now="$(jq -n now | cut -d. -f1)"
deleted=(); warned=(); kept=(); skipped=(); branches=()

# Listagem falha (rate limit, 5xx): a run falha junto, em vez de fingir que nao ha branches.
listing="$(api --paginate "repos/$REPO/branches?per_page=100" --jq '.[] | "\(.name) \(.commit.sha)"')"
while IFS= read -r line; do
  if [ -n "$line" ] && [ "${line% *}" != "$default_branch" ]; then branches+=("$line"); fi
done <<<"$listing"

prefix="[dry-run] "; [ "$DRY_RUN" = "1" ] || prefix=""

warn() { echo "::warning::$1: $2"; warned+=("\`$1\`: $2"); }
keep() { echo "mantida $1: $2"; kept+=("\`$1\`: $2"); }
skip() { echo "pulada $1: $2"; skipped+=("\`$1\`: $2"); }

delete_branch() { # name sha_visto reason
  local name="$1" seen="$2" reason="$3" sha_now
  if [ "$DRY_RUN" = "1" ]; then
    echo "${prefix}apagaria $name: $reason"; deleted+=("\`$name\`: $reason"); return
  fi
  # Trava contra corrida: rele a branch; se andou desde a listagem, nao apaga.
  # Janela residual: o intervalo entre esta releitura e o DELETE (menos de 1s), o GitHub nao oferece delete condicional.
  if ! sha_now="$(api "repos/$REPO/git/ref/heads/$(enc "$name")" --jq .object.sha 2>"$errfile")"; then
    if grep -q 'HTTP 404' "$errfile"; then skip "$name" "ja nao existe"; else keep "$name" "erro ao reler; fica pra proxima"; fi
    return
  fi
  if [ "$sha_now" != "$seen" ]; then keep "$name" "recebeu commit durante a faxina; fica pra proxima"; return; fi
  if ! api --method DELETE "repos/$REPO/git/refs/heads/$(enc "$name")" >/dev/null 2>"$errfile"; then
    keep "$name" "erro ao apagar; fica pra proxima"; return
  fi
  echo "apagada $name: $reason"; deleted+=("\`$name\`: $reason")
}

for line in ${branches[@]+"${branches[@]}"}; do
  name="${line% *}"; sha="${line##* }"

  # Erro de API numa branch (ex: apagada por outra sessao no meio) nao derruba a faxina inteira.
  if ! prs="$(api --method GET "repos/$REPO/pulls" -f state=all -f head="$OWNER:$name" -f per_page=30 2>"$errfile")"; then
    keep "$name" "erro ao consultar PRs; fica pra proxima"; continue
  fi

  # 1. PR aberto: nao mexe.
  open_pr="$(jq -r '[.[] | select(.state=="open")] | first | .number // empty' <<<"$prs")"
  if [ -n "$open_pr" ]; then keep "$name" "PR #$open_pr aberto"; continue; fi

  # 2. Ja contida na base: lixo seguro.
  if ! ahead="$(api "repos/$REPO/compare/$default_branch...$(enc "$name")" --jq .ahead_by 2>"$errfile")"; then
    keep "$name" "erro ao comparar com $default_branch; fica pra proxima"; continue
  fi
  if [ "$ahead" = "0" ]; then delete_branch "$name" "$sha" "ja contida em $default_branch"; continue; fi

  # 3. Algum PR fechado cujo head e exatamente o commit atual da branch: nada ficou fora do PR.
  read -r pr_number pr_merged < <(jq -r --arg sha "$sha" '[.[] | select(.state=="closed" and .head.sha==$sha)] | first
      | if . == null then "none none" else "\(.number) \(.merged_at != null)" end' <<<"$prs")
  if [ "$pr_number" != "none" ]; then
    if [ "$pr_merged" = "true" ]; then delete_branch "$name" "$sha" "PR #$pr_number mergeado"
    else delete_branch "$name" "$sha" "PR #$pr_number fechado sem merge (commits ficam no PR, restauravel la)"; fi
    continue
  fi

  # 4. Trabalho fora de PR: nunca apaga. Avisa quando parado ou quando e branch de vida longa.
  if ! last="$(api "repos/$REPO/commits/$sha" --jq '.commit.committer.date | fromdateiso8601' 2>"$errfile")"; then
    keep "$name" "erro ao ler o ultimo commit; fica pra proxima"; continue
  fi
  age_days=$(( (now - last) / 86400 ))
  case "$name" in
    develop|staging|release/*) warn "$name" "branch de vida longa com $ahead commit(s) a frente: viola o trunk-based; abrir PR pra $default_branch e aposentar"; continue;;
  esac
  last_closed="$(jq -r '[.[] | select(.state=="closed")] | first | .number // empty' <<<"$prs")"
  if [ -n "$last_closed" ]; then detail="PR #$last_closed fechado, mas a branch nao esta mais no commit dele"; else detail="sem PR"; fi
  if [ "$age_days" -ge "$STALE_DAYS" ]; then
    warn "$name" "$detail, parada ha $age_days dias com $ahead commit(s) a frente: abrir PR ou apagar na mao"
  else
    keep "$name" "$detail, ativa ha $age_days dia(s)"
  fi
done

section() { local title="$1"; shift; echo "### $title ($#)"; for i in "$@"; do echo "- $i"; done; echo; }
report="$(
  echo "## Faxina de branches (${prefix:-real})"; echo
  echo "Repo \`$REPO\`, base \`$default_branch\`, ${#branches[@]} branch(es) alem da base."; echo
  section "Apagadas" ${deleted[@]+"${deleted[@]}"}
  section "Avisos" ${warned[@]+"${warned[@]}"}
  section "Mantidas" ${kept[@]+"${kept[@]}"}
  section "Puladas" ${skipped[@]+"${skipped[@]}"}
)"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then printf '%s\n' "$report" >> "$GITHUB_STEP_SUMMARY"; else printf '%s\n' "$report"; fi

# Aviso vira issue no repo: uma so, atualizada a cada run, fechada sozinha quando nao sobra aviso.
# Editar o texto da issue nao notifica ninguem; por isso, quando entra ou sai branch da lista, tambem entra um comentario.
if [ "$DRY_RUN" = "1" ]; then exit 0; fi
warned_names() { tr -d '\r' | sed -n '/^### Avisos/,/^### /p' | grep -o '^- `[^`]*`' | sort; }
issues="$(api --method GET "repos/$REPO/issues" -f state=open -f per_page=100)"
existing="$(jq -r --arg t "$ISSUE_TITLE" '[.[] | select(.title==$t and (.pull_request|not))] | first | .number // empty' <<<"$issues")"
stamp="$(TZ=America/Sao_Paulo date +'%Y-%m-%d %H:%M BRT')"
if [ "${#warned[@]}" -gt 0 ]; then
  body="$(printf '%s\nUltima rodada: %s. Regras: ops/branch-cleanup/README.md' "$report" "$stamp")"
  if [ -n "$existing" ]; then
    old_warns="$(jq -r --arg t "$ISSUE_TITLE" '[.[] | select(.title==$t and (.pull_request|not))] | first | .body // ""' <<<"$issues" | warned_names || true)"
    new_warns="$(printf '%s\n' "$report" | warned_names || true)"
    api --method PATCH "repos/$REPO/issues/$existing" -f body="$body" >/dev/null; echo "issue #$existing atualizada"
    if [ "$old_warns" != "$new_warns" ]; then
      api --method POST "repos/$REPO/issues/$existing/comments" -f body="$(printf 'Entrou ou saiu branch da lista de avisos (%s):\n\n%s' "$stamp" "$(printf '%s\n' "$report" | tr -d '\r' | sed -n '/^### Avisos/,/^### /p' | grep '^- ' || true)")" >/dev/null
      echo "issue #$existing comentada (lista de branches em aviso mudou)"
    fi
  else
    n="$(api --method POST "repos/$REPO/issues" -f title="$ISSUE_TITLE" -f body="$body" --jq .number)"; echo "issue #$n aberta"
  fi
elif [ -n "$existing" ]; then
  api --method PATCH "repos/$REPO/issues/$existing" -f state=closed -f state_reason=completed >/dev/null; echo "issue #$existing fechada: sem avisos"
fi
