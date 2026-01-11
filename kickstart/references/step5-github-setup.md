# Step 5: GitHub Setup

Initialize Git version control and create remote GitHub repository.

---

## Overview

This step covers:

1. **Verify Git initialization** (or initialize if needed)
2. **Review .gitignore** (should exist from Step 2)
3. **Create initial commit**
4. **Create GitHub repository** (via CLI or web)
5. **Connect local to remote**
6. **Push code**
7. **Configure repository settings** (optional)

**Time**: 5-10 minutes

---

## Prerequisites

From previous steps:
- [ ] Project code exists
- [ ] `.gitignore` configured (Step 2)
- [ ] Environment files excluded from git

---

## Step 5.0: Check Git Status

### Verify Git Installation

```bash
git --version
```

Should show: `git version 2.x.x` or similar.

If not installed, install Git:
- **macOS**: `brew install git`
- **Linux**: `sudo apt-get install git` or `sudo yum install git`
- **Windows**: Download from https://git-scm.com/

### Check if Git is Initialized

```bash
git status
```

**If initialized**: You'll see current branch and file status
**If not initialized**: You'll see `fatal: not a git repository`

---

## Step 5.1: Initialize Git (if needed)

### If Git is NOT Initialized

```bash
git init
```

**Result**: Creates `.git/` directory

### Configure Git User (First Time Only)

If you haven't configured Git globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Check configuration:
```bash
git config --list
```

---

## Step 5.2: Review .gitignore

### Verify .gitignore Exists

Check that `.gitignore` was created in Step 2:

```bash
cat .gitignore
```

### Critical Items to Ignore

Ensure these are present:

```
# Environment
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build outputs
.next/
dist/
build/
.expo/

# IDE
.vscode/
.idea/

# OS
.DS_Store

# Claude Code
.claude/settings.local.json
```

### Add Missing Items

If anything critical is missing:

```bash
echo ".env.local" >> .gitignore
echo "node_modules/" >> .gitignore
```

---

## Step 5.3: Create Initial Commit

### Check Current Status

```bash
git status
```

You should see untracked files (all your project files).

### Stage All Files

```bash
git add .
```

### Verify Staged Files

```bash
git status
```

**Important**: Verify that sensitive files are NOT staged:
- `.env.local` or `.env` should NOT appear
- `node_modules/` should NOT appear
- Only `.env.example` should be staged

**If sensitive files are staged**:
```bash
git reset HEAD .env.local
git reset HEAD .env
```

### Create Initial Commit

```bash
git commit -m "Initial commit: project setup complete

- Tech stack configured (Step 1)
- Project structure created (Step 2)
- Supabase backend setup (Step 3)
- Style guide implemented (Step 4)
- Ready for remote repository"
```

**Result**: First commit created with descriptive message

### Verify Commit

```bash
git log
```

Should show your initial commit.

---

## Step 5.4: Create GitHub Repository

### Method A: Using GitHub CLI (Recommended if available)

#### Check if GitHub CLI is Installed

```bash
gh --version
```

If installed, you'll see: `gh version 2.x.x`

**If not installed**:
- **macOS**: `brew install gh`
- **Linux**: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md
- **Windows**: `winget install --id GitHub.cli`

#### Login to GitHub

```bash
gh auth login
```

Follow prompts:
1. Choose: GitHub.com
2. Choose: HTTPS
3. Authenticate via browser
4. Complete authorization

#### Create Repository

**Public repository**:
```bash
gh repo create your-project-name \
  --public \
  --source=. \
  --remote=origin \
  --push
```

**Private repository**:
```bash
gh repo create your-project-name \
  --private \
  --source=. \
  --remote=origin \
  --push
```

Replace `your-project-name` with your actual project name.

**What this does**:
1. Creates GitHub repository
2. Sets it as `origin` remote
3. Pushes your code automatically

**Result**: Repository created and code pushed!

#### Verify

```bash
gh repo view --web
```

Opens your repository in browser.

**Skip to Step 5.6** if using GitHub CLI.

### Method B: Using GitHub Web Interface

If GitHub CLI is not available, create repository manually.

#### 5.4B.1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: your-project-name
   - **Description**: Brief project description
   - **Visibility**: Public or Private
   - **DO NOT** initialize with README, .gitignore, or license
3. Click "Create repository"

#### 5.4B.2: Note Repository URL

GitHub will show commands. Note the HTTPS URL:
```
https://github.com/your-username/your-project-name.git
```

Or SSH URL (if you use SSH):
```
git@github.com:your-username/your-project-name.git
```

---

## Step 5.5: Connect Local to Remote (Manual Method)

**Skip this if you used GitHub CLI in 5.4A**

### Add Remote

**HTTPS**:
```bash
git remote add origin https://github.com/your-username/your-project-name.git
```

**SSH**:
```bash
git remote add origin git@github.com:your-username/your-project-name.git
```

### Verify Remote

```bash
git remote -v
```

Should show:
```
origin  https://github.com/your-username/your-project-name.git (fetch)
origin  https://github.com/your-username/your-project-name.git (push)
```

### Set Default Branch Name

```bash
git branch -M main
```

This renames `master` to `main` (GitHub's default).

---

## Step 5.6: Push Code to GitHub

**Skip this if you used GitHub CLI with --push flag**

### Push Initial Commit

```bash
git push -u origin main
```

The `-u` flag sets `origin/main` as the default upstream.

**First time**: May prompt for GitHub credentials
- Username: your GitHub username
- Password: GitHub personal access token (NOT your password)

**If prompted for password**:
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy token
5. Use token as password

### Verify Push

```bash
git log --oneline
```

Should show your commits.

Visit your repository on GitHub to verify code is there.

---

## Step 5.7: Update README with Repository Info

### Add GitHub Repository Link

Update `README.md`:

```markdown
# [Project Name]

🔗 **Repository**: https://github.com/your-username/your-project-name

[Brief description]

## Tech Stack

See `docs/tech-stack.md` for complete documentation.

## Getting Started

...existing content...
```

### Commit and Push

```bash
git add README.md
git commit -m "docs: add repository link to README"
git push
```

---

## Step 5.8: Configure Repository Settings (Optional)

### Branch Protection (Recommended for Teams)

1. Go to repository Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
4. Save changes

**Note**: Requires GitHub Pro for private repositories.

### Repository Topics

Add topics for discoverability:

1. Go to repository main page
2. Click ⚙️ (gear icon) next to "About"
3. Add topics:
   - Framework: `nextjs`, `react`, `expo`, etc.
   - Tools: `supabase`, `typescript`, `tailwindcss`, etc.
   - Purpose: `web-app`, `mobile-app`, etc.
4. Save changes

### Repository Description

Add a description:
1. Same settings as topics
2. Add: "Brief one-line description of your project"
3. Add website URL (if applicable)

### License (Optional)

Add a license if making open source:

1. Create new file: `LICENSE`
2. Choose license (MIT, Apache 2.0, etc.)
3. GitHub provides templates
4. Commit and push

---

## Step 5.9: Configure GitHub Actions (Optional)

### For Web Projects (Next.js)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
```

### For Mobile Projects (Expo)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
```

### Commit GitHub Actions

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow"
git push
```

GitHub will now run these checks on every push and PR.

---

## Step 5.10: Update Documentation

### Update docs/tech-stack.md

Add version control section:

```markdown
## Version Control

### Repository
- **Platform**: GitHub
- **URL**: https://github.com/your-username/your-project-name
- **Default Branch**: main

### Workflow
- Direct commits to `main` for small projects
- Feature branches + PRs for teams
- GitHub Actions for CI (if configured)

### Branch Protection
[Enabled / Not enabled]
```

### Update README.md

Ensure README has:
- Link to repository
- Instructions for cloning
- Setup instructions

```markdown
## Development

### Clone Repository

\```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
\```

### Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Add environment variables
4. Run dev server: `npm run dev`

See full setup guide in `docs/tech-stack.md`.
```

---

## Final Checklist

After Step 5:

**Git Setup:**
- [ ] Git initialized (`.git/` exists)
- [ ] `.gitignore` configured correctly
- [ ] Initial commit created
- [ ] Sensitive files NOT committed

**GitHub Repository:**
- [ ] Repository created on GitHub
- [ ] Public or Private visibility set
- [ ] Local connected to remote (`git remote -v` shows origin)
- [ ] Code pushed successfully

**Repository Configuration:**
- [ ] README updated with repo link
- [ ] Repository description added
- [ ] Topics added (optional)
- [ ] Branch protection configured (optional, for teams)
- [ ] GitHub Actions configured (optional)

**Documentation:**
- [ ] `docs/tech-stack.md` updated with repo info
- [ ] README has clone and setup instructions
- [ ] All documentation committed and pushed

**Verification:**
- [ ] Repository accessible on GitHub
- [ ] All files visible (except ignored ones)
- [ ] Can clone from fresh directory and setup works

---

## Common Issues

### "fatal: not a git repository"
- You're not in project directory
- Git not initialized → Run `git init`

### "Permission denied (publickey)"
- SSH key not configured
- Use HTTPS instead: `git remote set-url origin https://github.com/...`
- Or configure SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Support for password authentication was removed"
- GitHub no longer accepts passwords
- Create Personal Access Token: https://github.com/settings/tokens
- Use token as password when prompted

### ".env file committed by mistake"

**Remove from history**:
```bash
# Remove file from git but keep locally
git rm --cached .env.local

# Commit the removal
git commit -m "Remove .env.local from repository"

# Force push (if already pushed)
git push -f origin main
```

**Important**: Change all secrets in that file (they're now public).

### "Large files prevent push"
- Remove large files from commit
- Add to `.gitignore`
- Use Git LFS for large files if needed

---

## Next Steps

With GitHub configured:

✅ **Version control** enabled
✅ **Remote backup** on GitHub
✅ **Collaboration** ready (if team project)
✅ **CI/CD** foundation (if Actions configured)

**Next**:
- **Web projects** → Proceed to Step 6: Vercel
- **Mobile projects** → Proceed to Step 7: Expo
- **Both** → Do both steps 6 and 7

---

## Additional Resources

**Git**:
- [Git Documentation](https://git-scm.com/doc)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Git Guides](https://github.com/git-guides)

**GitHub**:
- [GitHub Documentation](https://docs.github.com)
- [GitHub CLI Manual](https://cli.github.com/manual/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

**Best Practices**:
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Branch Naming](https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
