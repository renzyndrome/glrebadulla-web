# Skill: Terminal copy voice

How to write any new or edited copy on glrebadulla.com so it stays in character.

## The metaphor
The page reads like a zsh session. Every structural label is a shell artifact:

| Element | Pattern | Examples |
|---|---|---|
| Nav item | `./section` | `./about`, `./projects` |
| Section header | muted command with green `$` | `$ whoami`, `$ cat about.md`, `$ ls skills/ --featured`, `$ ls projects/ --sort=impact`, `$ git log --oneline --experience`, `$ ping laurence --now` |
| Skill category | directory name | `llm-integration/`, `backend/` |
| Category tagline | `#` comment, lowercase, one line | `# APIs that hold up under real load` |
| Project name | kebab-case | `rag-analytics-assistant` |
| Button | command or file | `./view-projects`, `./hire-me`, `↓ download-cv.pdf` |
| Footer sign-off | `exit 0` | — |

## Writing rules
- Confident and direct. Short sentences. Facts over adjectives.
- **No em-dashes.** Use periods, commas, or ` · ` separators.
- No stacked adjectives or AI-sounding filler ("robust", "seamless", "cutting-edge", "grounded and measurable").
- No emoji.
- Every claim must map to a real CV fact.
- Body copy is normal English; only labels/headers use shell syntax. Don't over-extend the joke into paragraphs.

## Inventing new commands
Pick the command a developer would actually type for that intent: history → `git log`, listing → `ls`, identity → `whoami`, reaching out → `ping`. Flags may be playful but plausible (`--sort=impact`).
