# Owner decisions

Every decision the owner made for this repository, so the rules do not depend on anyone's memory of a conversation. Changing any entry needs the owner. An agent that finds a decision blocking a ticket stops and says so.

All entries are dated 2026-11-22.

| # | Decision | Implemented in |
|---|---|---|
| 1 | The instructions, tooling and playbook live on the default branch. | `CLAUDE.md`, `AGENTS.md`, `.claude/`, `.github/`, `docs/` |
| 2 | Persona agents run automatically during ticket work and carry instructions tailored to this project. | `.claude/agents/` ("In this repository" sections), `.claude/skills/implement-ticket/SKILL.md`, `.claude/agency-agents/README.md` |
| 3 | Every open ticket is about app implementation; tooling is installed, not ticketed. | Epic #1 and its tickets; tooling in `.claude/` and `.github/` |
| 4 | Agents may take a ticket up to a ready pull request. Only the owner merges and releases. | `CLAUDE.md` (Git workflow, Delivery workflow), `.claude/skills/next-ticket/SKILL.md`, `.claude/settings.json` (deny rules), `docs/RELEASING.md` |
| 5 | No scheduler. Ticket work starts only on the owner's go signal (`/next-ticket`), because the repository is used to train AI models. | `.claude/skills/next-ticket/SKILL.md` (`disable-model-invocation: true`), `LOOP.md` |
| 6 | A review gate hook blocks opening or readying a pull request until the gate roles have run after the last code edit. | `.claude/hooks/role-gate.mjs`, `.claude/settings.json` (hooks) |
| 7 | Loop Engineering stays at L1, report-only and unscheduled. | `LOOP.md`, `loop-constraints.md` |
| 8 | Continuous integration runs on Linux and Windows; the default branch requires a pull request and green checks. | `.github/workflows/ci.yml`; branch protection is set on GitHub after the merge |
| 9 | Permission rules: documented commands are allowed; force pushes, pushes to the default branch, merges, releases and reads of secrets are denied; edits to CI, agent configuration and Loop files ask first. | `.claude/settings.json` |
| 10 | Open decisions on tickets are settled with the ticket's stated default (list below). | Epic #1 "Owner decisions" and each ticket |
| 11 | Rust (where present) is verified in CI only. Not applicable: this repository has no Rust. | not applicable |
| 12 | The ten UI rules in `docs/ui-quality.md` are binding; the `ui-ux-pro-max` and `unslop` skills are installed and used for UI work and copy. | `docs/ui-quality.md`, `.claude/skills/ui-ux-pro-max/`, `.claude/skills/unslop/` |

## Entry 10: decisions settled with the ticket default

Issue numbers: E28-0 is #8 and E28-7 is #9; the epic table lists them.

- D1 (epic #1): no licence file is added; README keeps "has not been selected". Not blocking.
- D2 (#8): minimum Node 22, recorded in `package.json` `engines` and README; no claim for other versions.
- D3 (#8, #6, #7): no browser harness and no package; view logic is tested in Node; the real-browser keyboard walkthrough is an owner check.
- D4 (#4): seed 28, 200 programs of at most 32 instructions, own xorshift generator, coverage minimums printed.
- D5 (#9): full RAM snapshot at reset and every 256 committed boundaries.
- D6 (#9): JSON Lines trace format; the canonical hash is SHA-256 of the exact bytes.
- D7 (#6): each Run uses a budget of 1,000 boundaries, resume adds 1,000, hard cap 10,000.
- D8 (#5): mnemonics and registers case-insensitive, labels case-sensitive ASCII, at most 20 diagnostics.
- D9 (#8): default port 8280; `--port 0` picks a free port.
- D10 (all): the technical specification text is the contract for reset and commit-edge semantics; if it is ambiguous, stop and comment on the issue.
