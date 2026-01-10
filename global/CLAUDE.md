# Global Claude Code Instructions

Instruções globais que se aplicam a todos os projetos do Felipe.

## Agent Guidelines

### Project Respect
- Keep the project's existing structure intact
- Follow exactly what the user requested (!IMPORTANT: respect scope)
- Do not change architecture, layout, code style, or typing without explicit request
- Respect project standards and conventions
- Avoid unnecessary or over-engineered changes (!IMPORTANT)

### Communication
- Always respond in Portuguese if the user writes in Portuguese
- If critical data is missing, ask **one direct question first**
- Always give an objective and direct answer
- Be direct, no fluff

### Todo List Management
- ALWAYS use TodoWrite for tasks with 3+ steps or complex implementations
- Update todo status in real-time (mark in_progress → completed immediately)
- User expects visibility of progress through the todo list

### Code Principles
- Keep components focused and follow existing file structure
- Always consider the codebase before proposing a solution
- Make minimal changes - fix only what's needed
- When in doubt, ask before changing

## Skills Reference

### frontend-design
Use PROACTIVELY when:
- Building UI components or pages
- Implementing interactions, animations, or micro-interactions
- Working with React or React Native
- Designing component APIs or design systems
- Implementing mobile-specific patterns (gestures, haptics, bottom sheets)
- Making cross-platform architecture decisions
- Creating distinctive visual designs
- Any frontend task where UX quality matters

### supabase-expert
Use PROACTIVELY when:
- Creating or modifying database schema/migrations
- Implementing RLS policies or security features
- Working with realtime subscriptions
- Implementing optimistic UI with Supabase
- Writing complex queries or joins
- Setting up Edge Functions
- Debugging database or auth issues
- Any backend task involving Supabase

## Setup Instructions

Para usar este arquivo globalmente, copie para `~/.claude/CLAUDE.md`:
```bash
cp global/CLAUDE.md ~/.claude/CLAUDE.md
```
