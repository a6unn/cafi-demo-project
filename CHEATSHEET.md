# Claude Code Cheat Sheet
### CAFI Meetup — April 3, 2026

---

## Install & Start
```bash
npm install -g @anthropic-ai/claude-code   # Install
cd your-project                              # Navigate to project
claude                                       # Start Claude Code
```

---

## Essential Commands
| Command | What It Does |
|---------|-------------|
| `/clear` | Wipe context — use between unrelated tasks |
| `/compact` | Compress context — use when session gets slow |
| `/cost` | Check how full your context is |
| `/model sonnet` | Switch to fast/cheap model |
| `/model opus` | Switch to powerful model |
| `Escape` | Stop Claude mid-generation |

---

## Three Modes (cycle with Shift+Tab)
| Mode | What Claude Can Do |
|------|-------------------|
| **Normal** (default) | Asks permission before edits/commands |
| **Auto-Accept** (Shift+Tab once) | Edits and runs without asking |
| **Plan Mode** (Shift+Tab twice) | READ ONLY — research and planning |

---

## Context Meter — Know Your Thresholds
| Usage | Status | Action |
|-------|--------|--------|
| 0–50% | ✅ Safe | Work freely |
| 50–70% | ⚠️ Attention | Be mindful of task scope |
| 70–85% | 🟠 Degrading | Use /compact |
| 85–90% | 🔴 Danger | Hallucinations likely |
| 90%+ | 🚨 Critical | /clear immediately |

---

## The Pro Workflow: Research → Plan → Annotate → Implement

### Step 1: Research
```
Read the existing routes in src/routes/ in depth. Understand the patterns —
how endpoints are structured, how validation is done, how pagination works,
how errors are handled. Write your findings in research.md
```

### Step 2: Plan
```
I want to add a [feature]. [Describe fields and requirements].
Follow the exact patterns from [existing file]. Include [model, route,
validation, pagination, tests]. Write a detailed plan.md.
Don't implement yet.
```

### Step 3: Annotate
Open plan.md → add your notes → send back:
```
I added notes to the plan. Address all notes and update accordingly.
Don't implement yet.
```
Repeat 1–6 times until the plan is right.

### Step 4: Implement
```
Implement the plan in plan.md. Mark each task as done when completed.
Don't stop until everything is done. Run npm test after each major change.
```

---

## CLAUDE.md Template
Create this file in your project root:
```markdown
# Project: [Your Project Name]

## Stack
[Your tech stack — framework, database, ORM, etc.]

## Conventions
- [Your coding conventions]
- [Pagination approach]
- [Error handling patterns]

## Rules
- [Things Claude must NEVER do]
- [Things Claude must ALWAYS do]

## Commands
[npm test | npm run lint | npm run dev]
```

**Tip:** Ask Claude to help write it:
```
Help me write a CLAUDE.md for this project. Interview me about my
tech stack, coding conventions, and common commands. Then generate the file.
```

---

## Top 5 Mistakes & Fixes
| Mistake | Fix |
|---------|-----|
| Piling tasks in one session | `/clear` between tasks |
| No CLAUDE.md | 10 min to write 15 lines. Do it once. |
| Jumping straight to code | Shift+Tab twice → Plan Mode first |
| Correcting over and over | After 2 failures: `/clear` + better prompt |
| Vague prompts | Name the endpoint, file, pattern, test |

---

## Resources
- Boris Tane's workflow: `boristane.com/blog/how-i-use-claude-code/`
- Claude Code docs: `code.claude.com`
- CAFI community: `meetup.com/chennai-ai-fluency-initiative-cafi`
- Demo project: `github.com/ArunGanesan/cafi-demo-project`

---

*From Prompt to Production — CAFI × Ideas2IT Technologies*
