---
name: kickstart
description: Initialize new projects with complete tech stack setup, configuration, and development environment. Use when starting a project from scratch or completing missing setup pieces. Handles tech stack definition (web/mobile/both), Supabase configuration, style guide implementation, GitHub/Vercel/Expo setup, and skills/tools validation.
---

# Kickstart

Initialize projects with complete tech stack and development environment setup.

## When to Use

Use this skill when:
- Starting a brand new project from an empty folder
- Existing project is missing core setup pieces (backend not configured, no deployment, etc)
- Need to ensure all development tools and skills are properly installed
- Want to follow standardized project initialization workflow

## Process Overview

The kickstart process has **8 core steps**, always starting with analysis:

**Step 0: Analyze Current State**
- Understand what already exists in the project
- Identify which steps are needed vs already complete
- Determine starting point

**Step 1: Tech Stack** → See [step1-tech-stack.md](references/step1-tech-stack.md)
- Gather business requirements via 5 key questions
- Recommend stack based on default preferences
- Implement complete tech stack with all dependencies

**Step 2: Stack Configuration** → See [step2-stack-configuration.md](references/step2-stack-configuration.md)
- Create folder structure (web vs mobile differences)
- Configure TypeScript, ESLint, styling systems
- Set up environment variables and framework configs
- Configure QueryClient and providers
- Create documentation files

**Step 3: Backend Setup** → See [step3-supabase-setup.md](references/step3-supabase-setup.md)
- Create Supabase project via dashboard
- Get credentials (URL + Anon Key)
- Update environment variables
- Test connection
- Generate TypeScript types (optional)
- Configure Row Level Security basics

**Step 4: Style Guide** → See [step4-style-guide.md](references/step4-style-guide.md)
- Identify UI framework (from Step 1)
- Generate theme using appropriate tool:
  - Shadcn/Tailwind → Tweak.cn editor
  - Tamagui → Tamagui Theme Studio
  - Others → Search or adapt
- Implement theme in project
- Document style guide (colors, typography, spacing)
- Create example components

**Step 5: GitHub** → See [step5-github-setup.md](references/step5-github-setup.md)
- Initialize Git (if not already)
- Review .gitignore from Step 2
- Create initial commit
- Create GitHub repository (via CLI or web)
- Connect local to remote
- Push code
- Configure repository settings (optional)

**Step 6: Vercel** → See [step6-vercel-deployment.md](references/step6-vercel-deployment.md) *(if web)*
- Create Vercel account
- Install CLI (optional)
- Connect GitHub repository
- Configure environment variables
- Deploy project
- Configure custom domain (optional)

**Step 7: Expo** → See [step7-expo-deployment.md](references/step7-expo-deployment.md) *(if mobile)*
- Install EAS CLI
- Login to Expo account
- Configure EAS Build
- Create development build
- Test on device/simulator
- Create production builds (optional)
- Submit to app stores (guidance)

**Step 8: Claude Code Toolkit** → See [step8-tools-validation.md](references/step8-tools-validation.md)
- Claude Code CLI validation
- Marketplace discovery and installation (dynamic)
- Plugins sync (commands, skills, agents, hooks)
- CLAUDE.md best practices validation
- Settings and permissions configuration
- Integration testing of all extensions
- Dynamic validation command creation

## Workflow

1. **Always start with Step 0** - Analyze current state
2. **Execute missing steps in order** - Skip steps that are already complete
3. **Test after each major step** - Verify everything works before proceeding
4. **Document decisions** - Keep track of choices made for future reference

## Quick Start

1. Navigate to your project directory (empty or existing)
2. Tell Claude to "kickstart this project" or "use kickstart skill"
3. Provide PRD if available (skill will infer answers and confirm)
4. Confirm recommendations and proceed with implementation

## Current Status

**Implemented:**
- Step 0: Analyze Current State (analyze what exists, skip complete steps)
- Step 1: Tech Stack (business requirements → recommendations → implementation)
- Step 2: Stack Configuration (modular framework-specific setup + Claude Code settings)
- Step 3: Backend Setup (Supabase with MCP automation + manual fallback)
- Step 4: Style Guide (theme generators: Tweak.cn for web, Tamagui for mobile)
- Step 5: GitHub (git init, repository creation, automatic deployments)
- Step 6: Vercel (web deployment with CI/CD)
- Step 7: Expo (EAS Build configuration and deployment)
- Step 8: Tools Validation (complete verification and project ready criteria)

**Status**: ✅ Complete - All 8 steps implemented and tested

## Critical Principles

1. **Instant UX**: Every user interaction must feel instant via optimistic updates, regardless of backend architecture
2. **Business Language**: Ask questions in business terms, not technical jargon
3. **Preferences First**: Always start with default preferences, adjust only when requirements demand
4. **Test Everything**: Every step must be verified before moving to the next
5. **Progressive Disclosure**: Only load detailed steps when needed
