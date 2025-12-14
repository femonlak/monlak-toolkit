---
name: deploy-vercel
description: Automate commit, push, and Vercel deployment workflow with automatic error recovery. This skill should be used when the user asks to "commit and deploy", "deploy everything", "faz commit e deploy", or similar requests. It handles the complete deployment lifecycle including monitoring, error investigation, automatic fixes, PR creation, and merge to production.
---

# Deploy Vercel Skill

Automate the complete deployment workflow: commit changes, push to remote, monitor Vercel deployment, and handle errors automatically with investigation and fixes.

## When to Use

This skill triggers when the user requests:
- "faz commit e deploy"
- "commit e deploy de tudo"
- "deploy tudo que foi feito"
- "commit and deploy"
- "deploy everything"
- Any variation requesting commit + deployment

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      MAIN WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│  1. Commit changes                                               │
│  2. Push to remote                                               │
│  3. Monitor Vercel deployment (poll every 30s)                   │
│  4. If SUCCESS → confirm to user                                 │
│  5. If ERROR → investigate, fix, repeat (max 3 attempts)         │
│  6. If not on main branch → offer PR flow                        │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Workflow

### Phase 1: Commit and Push

1. **Check git status** to identify changes
2. **Run git diff** to understand what will be committed
3. **Check recent commits** for commit message style
4. **Stage and commit** with descriptive message following project conventions
5. **Push to remote** with appropriate branch

### Phase 2: Monitor Deployment

1. **Wait 10 seconds** for Vercel to detect the push
2. **Poll deployment status** using Vercel CLI every 30 seconds:
   ```bash
   vercel list 2>&1 | head -15
   ```
3. **Check for status indicators:**
   - `● Building` → continue polling
   - `● Ready` → deployment successful
   - `● Error` → deployment failed

### Phase 3: Handle Success

If deployment succeeds:

1. **Confirm to user** with deployment URL
2. **Check current branch:**
   - If `main` → workflow complete
   - If other branch → proceed to PR Flow (Phase 5)

### Phase 4: Handle Error (Auto-Recovery Loop)

If deployment fails (max 3 attempts):

1. **Fetch error logs** using Vercel CLI:
   ```bash
   vercel logs <deployment-url> 2>&1
   ```
   Or check build logs in the deployment details.

2. **Investigate root cause:**
   - Analyze error messages
   - Identify failing file/component
   - Read relevant source files
   - Determine fix strategy

3. **Plan the fix:**
   - Document what went wrong
   - Propose minimal fix
   - Explain the solution

4. **Implement the fix:**
   - Make necessary code changes
   - Verify TypeScript/lint errors locally if applicable

5. **Commit and push again:**
   - New commit with fix description
   - Push to same branch

6. **Repeat from Phase 2** (monitor deployment)

7. **If max attempts reached:**
   - Report all attempted fixes
   - Show remaining errors
   - Ask user for guidance

### Phase 5: PR Flow (Non-main branches)

After successful deployment on a feature branch:

1. **Ask user:** "Deploy na branch foi bem-sucedido. Quer criar um Pull Request?"

2. **If user confirms PR creation:**
   - Check for existing PR
   - Create PR using `gh pr create` with summary of changes
   - Report PR URL to user

3. **Check PR status:**
   - Verify CI checks pass
   - Report any issues

4. **Ask user:** "PR está pronto. Quer fazer o merge para main?"

5. **If user confirms merge:**
   - Execute `gh pr merge` with appropriate strategy
   - Wait for merge to complete

6. **Monitor production deployment:**
   - Return to Phase 2 for main branch deployment
   - Apply same error recovery if needed

## Commands Reference

### Git Commands
```bash
git status
git diff
git log --oneline -5
git add <files>
git commit -m "<message>"
git push origin <branch>
git branch --show-current
```

### Vercel CLI Commands
```bash
# List recent deployments
vercel list 2>&1 | head -15

# Get deployment logs (for errors)
vercel logs <deployment-url> 2>&1

# Inspect specific deployment
vercel inspect <deployment-url> 2>&1
```

### GitHub CLI Commands
```bash
# Create PR
gh pr create --title "<title>" --body "<body>"

# Check PR status
gh pr view

# Merge PR
gh pr merge --squash --delete-branch
```

## Configuration

| Setting | Value |
|---------|-------|
| Polling interval | 30 seconds |
| Max fix attempts | 3 |
| Initial wait after push | 10 seconds |

## Error Investigation Strategy

When a deployment fails, investigate in this order:

1. **Build errors:** TypeScript, ESLint, compilation failures
2. **Runtime errors:** Missing dependencies, import issues
3. **Environment issues:** Missing env vars, wrong Node version
4. **Configuration errors:** next.config.js, vercel.json issues

## Important Notes

- Always use `vercel list` to check deployment status, not the Vercel dashboard
- Deployment URLs from `vercel list` contain the deployment ID needed for logs
- The status column shows: `● Building`, `● Ready`, `● Error`, or `● Queued`
- When fixing errors, make minimal changes - fix only what's broken
- Keep commit messages descriptive of the fix applied
