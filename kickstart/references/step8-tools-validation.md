# Step 8: Claude Code Toolkit Validation

Validate and sync Claude Code extensions from marketplace, ensure CLAUDE.md follows best practices.

**Primary Focus**: Claude Code ecosystem (plugins, hooks, skills, agents, commands, MCP servers)

---

## Overview

This step validates:

1. **Claude Code CLI** installed and working
2. **Marketplace** added and accessible
3. **Plugins** from marketplace installed
4. **CLAUDE.md** follows best practices
5. **Project configuration** (settings, permissions)
6. **Extensions** working (test hooks, commands, skills)

**Time**: 10-15 minutes

**Philosophy**: Dynamic validation - reads directly from marketplace, not hardcoded expectations

---

## Prerequisites

From previous steps:
- [x] Project exists with code
- [x] Git repository configured
- [x] Development environment working

**This step is Claude Code-centric**: Validates tooling for agentic coding workflow.

---

## Step 8.0: Verify Claude Code Installation

### Check Claude Code CLI

```bash
claude-code --version
```

**Expected**: Version number (e.g., `claude-code 2.0.x`)

**If not installed**:
```bash
# macOS
brew install claude-code

# Or download from
# https://code.claude.com
```

### Verify Claude Code Works

```bash
claude-code --help
```

Should show available commands and options.

---

## Step 8.1: Add Marketplace

### Strategy

Instead of hardcoding a specific marketplace, this step:
1. Checks if any marketplaces are configured
2. If none, prompts for marketplace URL
3. Validates marketplace is accessible

### Check Current Marketplaces

```bash
# Inside Claude Code session
/plugin marketplace list
```

**Or check settings**:
```bash
cat ~/.claude/settings.json | grep marketplaces
```

###

 Add Your Marketplace

**Generic command**:
```bash
# In Claude Code session
/plugin marketplace add <github-user>/<repo-name>

# Example
/plugin marketplace add femonlak/monlak-toolkit
```

**Or via GitHub URL**:
```bash
/plugin marketplace add https://github.com/your-org/your-toolkit.git
```

### Verify Marketplace Added

```bash
/plugin marketplace list
```

Should show your marketplace in the list.

---

## Step 8.2: Discover Available Plugins

### List Marketplace Plugins

```bash
/plugin list
```

**Or more detailed**:
```bash
/plugin marketplace show <marketplace-name>
```

### Inspect Marketplace Structure

Marketplaces typically contain:
- `commands/` - Slash commands (`.md` files)
- `agents/` - Subagents (`.md` files in `.claude/agents/`)
- `skills/` - Agent Skills (folders with `SKILL.md`)
- `hooks/` - Event hooks (configuration in `settings.json`)
- `.claude-plugin/` - Plugin metadata

### Parse Available Components

**From marketplace repo**, check what's available:
- Browse GitHub repo structure
- Read README for component list
- Check `.claude-plugin/marketplace.json` or `plugin.json` files

**Example** (monlak-toolkit structure):
```
monlak-toolkit/
├── commands/          # Slash commands
├── hooks/             # Hook configurations
├── deploy-vercel/     # Skills
├── new-feature/       # More skills
└── global/            # CLAUDE.md template
```

---

## Step 8.3: Install Missing Plugins

### Check Currently Installed

```bash
/plugin status
```

Shows installed plugins and their components.

### Install Specific Plugin

**Format**:
```bash
/plugin install <plugin-name>@<marketplace-name>
```

**Example**:
```bash
/plugin install deploy-vercel@monlak-toolkit
```

### Install All Recommended Plugins

**Strategy**: Read marketplace README for recommended plugins, install each.

**Generic approach**:
1. List available plugins from marketplace
2. For each plugin:
   - Check if installed (`/plugin status`)
   - If not installed → `/ install <plugin>@<marketplace>`
3. Verify installation successful

### Verify Installation

```bash
/plugin status
```

**Check specific components**:
- Commands: `/` then Tab (autocomplete shows available commands)
- Skills: Check `.claude/skills/` directory
- Agents: Check `.claude/agents/` directory

---

## Step 8.4: Validate CLAUDE.md

### CLAUDE.md Best Practices

Based on Claude Code documentation and community best practices:

**Structure Requirements**:
1. **Concise** - No verbose paragraphs, bullet points only
2. **Modular** - Clear sections (Tech Stack, Commands, Structure, Conventions)
3. **Universal** - Only rules that apply to ALL tasks
4. **~150-200 instructions max** - Claude Code system prompt uses ~50 already

**Content Guidelines**:
- ✅ Tech stack and versions
- ✅ Essential commands (dev, build, test, deploy)
- ✅ Project structure (key directories)
- ✅ Workflow rules (git, PR, deployment)
- ✅ File boundaries (what Claude can/cannot touch)
- ❌ Style guidelines (use formatters/linters via hooks instead)
- ❌ Verbose explanations
- ❌ Redundant information

**Hierarchy**:
```
~/.claude/CLAUDE.md           # Global (all projects)
<project-root>/CLAUDE.md      # Project-specific
<project-root>/.claude/CLAUDE.md  # Alternative location
```

### Validate Existing CLAUDE.md

**Check if exists**:
```bash
# Project root
cat CLAUDE.md

# Or in .claude/
cat .claude/CLAUDE.md
```

**If doesn't exist** → Generate with `/init`:
```bash
# In Claude Code session
/init
```

Claude will analyze project and generate CLAUDE.md.

### Validate Against Best Practices

**Run validation checks**:

1. **Length check**:
```bash
wc -l CLAUDE.md
```
Should be reasonable (not 500+ lines).

2. **Structure check** - CLAUDE.md should have clear sections:
```markdown
# Project Name

## Tech Stack
- Framework: X
- Language: Y
- Database: Z

## Commands
- `npm run dev` - Start development
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure
- `src/app` - Application code
- `src/components` - Reusable components
- `src/lib` - Utilities

## Workflow
- Use feature branches
- PR required for main
- Run tests before commit

## Do Not
- Do not edit files in `node_modules/`
- Do not commit `.env` files
```

3. **Content check**:
- No verbose paragraphs ✓
- No redundant style guidelines (defer to formatters) ✓
- Commands are accurate ✓
- Structure reflects actual project ✓

### Import Pattern

CLAUDE.md can import other files:
```markdown
See @README for overview and @package.json for scripts.

# Additional Instructions
- @docs/git-workflow.md
- @~/.claude/my-preferences.md
```

**Validation**: Verify imported files exist.

### Update CLAUDE.md

If generated CLAUDE.md needs improvements:
1. Edit manually
2. Or ask Claude to refine: "Update CLAUDE.md to follow best practices"
3. Commit changes

---

## Step 8.5: Configure Hooks (Optional)

### What Are Hooks?

Claude Code hooks run shell commands at specific lifecycle events:
- `SessionStart` - When Claude starts
- `PreToolUse` - Before tool execution
- `PostToolUse` - After tool execution
- `UserPromptSubmit` - When user submits prompt
- `Stop` - When Claude finishes
- `SubagentStop` - When subagent finishes
- `PreCompact` - Before compaction
- `SessionEnd` - When session ends

### Check Marketplace Hooks

**If marketplace provides hooks** (like `monlak-toolkit/hooks/`):
1. Review hook configurations
2. Understand what each hook does
3. Decide which to enable

**Example** (audio notification hooks):
```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "afplay ~/.claude/sounds/complete.wav"
      }]
    }]
  }
}
```

### Install Hooks

**Manual installation**:
1. Copy hook configuration from marketplace
2. Add to `~/.claude/settings.json` or `.claude/settings.json`
3. Test hook execution

**Hooks are configured in settings.json, NOT installed via `/plugin install`**

### Verify Hooks

Trigger events to test:
- Start new session → `SessionStart` hook
- Run command → `PreToolUse` and `PostToolUse` hooks
- Finish task → `Stop` hook

Check terminal output or configured actions (sounds, logs, etc.)

---

## Step 8.6: Validate Commands

### List Available Commands

```bash
# In Claude Code
/

# Then press Tab
```

Autocomplete shows all available slash commands.

### Test Marketplace Commands

**For each command from marketplace**:
1. Try running it
2. Verify it works as expected
3. Check output/behavior

**Example**:
```bash
/deploy-vercel
```

If from `monlak-toolkit`, should trigger deploy workflow.

### Verify Command Files

**Project commands**:
```bash
ls -la .claude/commands/
```

**Global commands**:
```bash
ls -la ~/.claude/commands/
```

Each `.md` file is a command.

---

## Step 8.7: Validate Skills

### What Are Skills?

Agent Skills activate automatically based on task context (unlike commands which are manual).

**Structure**:
```
skill-name/
├── SKILL.md         # Skill description and behavior
└── references/      # Supporting files (optional)
```

### Check Installed Skills

```bash
ls -la ~/.claude/skills/
ls -la .claude/skills/
```

### Test Skills

Skills activate automatically, but you can verify:
1. Start task that should trigger skill
2. Check if Claude mentions using the skill
3. Verify skill behavior

**Example**: If marketplace has `deploy-vercel` skill:
- Ask Claude: "Deploy this to Vercel"
- Skill should activate automatically
- Claude mentions using skill or follows skill workflow

---

## Step 8.8: Validate Agents

### What Are Agents?

Subagents are specialized agents for specific tasks, invoked via Task tool or commands.

**Location**:
```
.claude/agents/<agent-name>.md
~/.claude/agents/<agent-name>.md
```

### Check Installed Agents

```bash
ls -la .claude/agents/
ls -la ~/.claude/agents/
```

### Test Agent

**Invoke via command** (if marketplace provides command):
```bash
/<command-that-uses-agent>
```

**Or invoke directly**:
```
Create a subagent task to <do something>
```

Claude should use configured agent.

---

## Step 8.9: Validate MCP Servers (Optional)

### What Are MCP Servers?

Model Context Protocol servers connect external tools (databases, APIs, services).

**Configuration**: `.mcp.json` file

### Check If Marketplace Provides MCP

Look for `.mcp.json` in marketplace plugins.

### Configure MCP

If marketplace provides MCP configuration:
1. Review `.mcp.json`
2. Add to project or global config
3. Launch Claude with `--mcp-debug` for testing

### Verify MCP

```bash
# Check available MCP tools
/mcp list
```

---

## Step 8.10: Project Settings Validation

### Check Settings Files

**Hierarchy**:
1. `~/.claude/settings.json` - Global settings
2. `.claude/settings.json` - Project settings
3. `.claude/settings.local.json` - Local (git-ignored)

### Verify Permissions

```bash
cat ~/.claude/settings.json
```

**Should contain**:
```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)",
      "Write(*)",
      "Update(*)",
      ...
    ]
  }
}
```

### Verify Marketplace-Specific Settings

If marketplace requires specific settings:
1. Check marketplace documentation
2. Verify settings are configured
3. Merge with existing settings (don't overwrite)

---

## Step 8.11: Final Integration Test

### Run Complete Workflow

Test end-to-end with marketplace tools:

**Example workflow**:
1. Start Claude Code
2. Verify marketplace plugins loaded
3. Test a command: `/<marketplace-command>`
4. Verify skills activate when relevant
5. Check hooks trigger (if configured)
6. Complete a task using marketplace workflow

### Verify Everything Works

Checklist:
- [ ] Marketplace accessible
- [ ] Plugins installed
- [ ] Commands work
- [ ] Skills activate automatically
- [ ] Hooks trigger (if configured)
- [ ] Agents invokable
- [ ] CLAUDE.md loaded and followed

---

## Final Checklist

After Step 8:

**Claude Code**:
- [ ] CLI installed and working
- [ ] Can start Claude Code session
- [ ] Version is up-to-date

**Marketplace**:
- [ ] Marketplace added successfully
- [ ] Can list available plugins
- [ ] Marketplace is accessible from Claude Code

**Plugins**:
- [ ] All recommended plugins installed
- [ ] Plugins from marketplace are active
- [ ] No installation errors

**CLAUDE.md**:
- [ ] File exists (project root or `.claude/`)
- [ ] Follows best practices (concise, modular, ~150-200 rules)
- [ ] Sections: Tech Stack, Commands, Structure, Workflow
- [ ] No verbose style guidelines (use hooks/formatters)
- [ ] Imported files exist (if using `@imports`)
- [ ] Claude loads and follows CLAUDE.md

**Commands**:
- [ ] Can list commands with Tab autocomplete
- [ ] Marketplace commands available
- [ ] Test command executes successfully

**Skills** (if applicable):
- [ ] Skills installed in `.claude/skills/`
- [ ] Skills activate automatically when relevant
- [ ] Skills behavior correct

**Agents** (if applicable):
- [ ] Agents installed in `.claude/agents/`
- [ ] Can invoke agents via commands or Task tool
- [ ] Agents behave as expected

**Hooks** (optional):
- [ ] Hooks configured in `settings.json`
- [ ] Hooks trigger at expected lifecycle events
- [ ] Hook actions execute correctly

**Settings**:
- [ ] Permissions configured
- [ ] Settings hierarchy correct (global → project → local)
- [ ] No conflicting settings

**Integration**:
- [ ] End-to-end workflow works
- [ ] Marketplace extensions integrate smoothly
- [ ] Claude Code enhanced by marketplace

---

## Troubleshooting

### Marketplace not accessible

**Check URL**:
```bash
# Verify repo is public and accessible
curl -I https://github.com/<user>/<repo>
```

**Re-add marketplace**:
```bash
/plugin marketplace remove <marketplace-name>
/plugin marketplace add <user>/<repo>
```

### Plugin installation fails

**Check plugin structure**:
- Verify `.claude-plugin/plugin.json` exists
- Check plugin metadata is valid JSON
- Ensure components (commands, agents, skills) are in correct locations

**Clear cache**:
```bash
rm -rf ~/.claude/plugin-cache
```

### CLAUDE.md not loading

**Check location**:
```bash
# Should be in one of these locations
ls CLAUDE.md
ls .claude/CLAUDE.md
ls ~/.claude/CLAUDE.md
```

**Verify syntax**:
- Must be valid Markdown
- Check for syntax errors
- Verify imports (`@file`) point to existing files

**Test**:
```bash
# In Claude Code
/memory
```

Shows loaded memory files including CLAUDE.md

### Commands not showing

**Check command files**:
```bash
ls .claude/commands/
ls ~/.claude/commands/
```

**Verify format**:
- Files must be `.md`
- Content must be plain text instructions
- Can use `$ARGUMENTS` for parameters

**Reload**:
```bash
# Exit and restart Claude Code
```

### Skills not activating

**Check skill files**:
```bash
ls ~/.claude/skills/
```

**Verify structure**:
```
skill-name/
└── SKILL.md
```

**Skill activation is automatic** - you don't manually invoke them. They activate based on task context described in `SKILL.md`.

### Hooks not executing

**Check configuration**:
```bash
cat ~/.claude/settings.json | jq '.hooks'
```

**Verify command is executable**:
```bash
# Test hook command manually
<your-hook-command>
```

**Check exit codes**:
- Exit 0 = success
- Exit 2 = blocking error
- Other = non-blocking error

---

## Best Practices Summary

### CLAUDE.md

**Do**:
- Keep concise (bullet points, not paragraphs)
- Include essential commands only
- Define clear file boundaries
- Document actual workflow (not theoretical)
- Use imports (`@file`) for modularity

**Don't**:
- Include verbose style guidelines (use formatters)
- Add instructions for specific tasks (use skills/commands)
- Exceed ~200 instructions
- Include redundant information
- Write for humans (write for Claude)

### Hooks

**Do**:
- Use for deterministic checks (linting, formatting)
- Keep hooks fast (< 1 second)
- Return meaningful exit codes
- Log to files for debugging

**Don't**:
- Use for complex logic (use skills/agents)
- Block on slow operations
- Rely on hooks for critical security

### Commands

**Do**:
- Create commands for frequent workflows
- Use clear, descriptive names
- Include usage examples in command file
- Document parameters with `$ARGUMENTS`

**Don't**:
- Create commands for one-time tasks
- Duplicate functionality (check existing commands)
- Use overly complex prompts (break into skills)

### Skills

**Do**:
- Create skills for automatic behaviors
- Write clear activation criteria in SKILL.md
- Test skill activation with relevant tasks
- Keep skills focused (one purpose)

**Don't**:
- Create skills for manual workflows (use commands)
- Overlap skill activation criteria
- Make skills too broad or too narrow

---

## Next Steps

With Claude Code toolkit validated:

✅ **Development environment** optimized for agentic coding
✅ **Marketplace extensions** installed and working
✅ **CLAUDE.md** following best practices
✅ **Workflow enhanced** with commands, skills, agents, hooks

**Your project is now ready for:**
- Efficient agentic development with Claude Code
- Consistent workflows across team (if shared)
- Rapid feature development using marketplace tools
- Automated quality checks via hooks
- Specialized agents for complex tasks

---

## Maintaining Your Toolkit

### Regular Updates

**Update marketplace**:
```bash
/plugin marketplace update
```

**Update plugins**:
```bash
/plugin update <plugin-name>
```

### Evolve CLAUDE.md

As project grows:
1. Add new patterns discovered
2. Remove outdated instructions
3. Refine based on friction points
4. Keep it current with actual workflow

### Review Hooks

Periodically check:
- Are hooks still relevant?
- Are they slowing down workflow?
- Should new hooks be added?

### Share With Team

If team project:
1. Commit `.claude/` directory (except `settings.local.json`)
2. Document setup in README
3. Share marketplace URL
4. Maintain consistency across team

---

## Additional Resources

**Claude Code Documentation**:
- [Official Docs](https://code.claude.com/docs)
- [CLAUDE.md Guide](https://claude.com/blog/using-claude-md-files)
- [Plugins](https://claude.com/blog/claude-code-plugins)
- [Hooks Reference](https://code.claude.com/docs/en/hooks)
- [Agent Skills](https://code.claude.com/docs/en/agent-skills)

**Community**:
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)
- [Claude Code Plugins Marketplace](https://claude-plugins.dev/)
- [Community Discussions](https://github.com/anthropics/claude-code/discussions)

**Best Practices**:
- [Claude Code Best Practices (Anthropic)](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Writing a Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [CLAUDE.md Structure](https://callmephilip.com/posts/notes-on-claude-md-structure-and-best-practices/)

---

## Conclusion

🎉 **Kickstart Complete!**

All 8 steps finished:

1. ✅ **Tech Stack** - Optimal technologies chosen
2. ✅ **Stack Configuration** - Project structure set up
3. ✅ **Backend Setup** - Supabase connected
4. ✅ **Style Guide** - Design system implemented
5. ✅ **GitHub** - Version control configured
6. ✅ **Vercel** - Web deployed (if web)
7. ✅ **Expo** - Mobile configured (if mobile)
8. ✅ **Claude Code Toolkit** - Extensions validated

**Your project now has:**
- Production-ready infrastructure
- Modern development stack
- Automated CI/CD pipeline
- Optimized Claude Code workflow
- Marketplace extensions integrated
- Best practices CLAUDE.md
- Quality automation via hooks

**Now build with velocity!** 🚀

---

## Dynamic Validation Script (Advanced)

For automated validation, create `.claude/commands/validate-toolkit.md`:

```markdown
---
description: Validate Claude Code toolkit and marketplace extensions
---

# Validate Toolkit

Run comprehensive validation of Claude Code setup:

1. Check marketplace accessible
2. List installed plugins
3. Verify CLAUDE.md exists and follows best practices
4. Test commands work
5. Verify skills present
6. Check agents available
7. Test hooks (if configured)
8. Generate validation report

Report issues found and suggest fixes.

Output results in structured format:
- ✅ What's working
- ⚠️  Warnings
- ❌ What needs fixing
- 📝 Recommendations

Execute validation now.
```

Then run: `/validate-toolkit`

This creates a maintainable, executable validation workflow.
