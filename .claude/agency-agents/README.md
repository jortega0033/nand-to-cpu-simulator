# Agency Agents roles used in this repository

The Markdown files in `.claude/agents/` whose names start with `engineering-`, `security-` or `testing-` are copies of role definitions from Agency Agents. They are project-local Claude Code subagents. The file `loop-verifier.md` in the same folder is not from Agency Agents; it belongs to the Loop Engineering setup described in [`LOOP.md`](../../LOOP.md).

## Source and licence

- Upstream: https://github.com/msitarzewski/agency-agents
- Pinned revision: `8ae6164602c95ca78828b148b9052460ee426885` (upstream `main`, committed 2026-11-09)
- Licence: MIT, "Copyright (c) 2025 AgentLand Contributors". The upstream licence text at the pinned revision is kept unchanged in [`LICENSE`](LICENSE) next to this file (SHA-256 `9a45258434d5cedf0af73c9ad4771373701225038d246c49219026c33677f66f`). It covers only the copied role files, not the rest of this repository.
- Fetched with `gh api -H "Accept: application/vnd.github.raw" "repos/msitarzewski/agency-agents/contents/<path>?ref=<revision>"`.

## Installed roles

"Upstream SHA-256" is the hash of the file as fetched at the pinned revision. Reviewer roles have one added frontmatter line, `tools: Read, Grep, Glob`, so they cannot edit files or run commands. Nothing else in any file was changed by the install step.

| File in `.claude/agents/` | `name:` | Upstream path | Upstream SHA-256 | Local change |
|---|---|---|---|---|
| `engineering-software-architect.md` | Software Architect | `engineering/engineering-software-architect.md` | `b85121691776147bacde26673e68fbbacd6a7f0816d1ca8e203c264d25ce1d30` | added `tools: Read, Grep, Glob` |
| `engineering-code-reviewer.md` | Code Reviewer | `engineering/engineering-code-reviewer.md` | `7509fcc3ea1dda46511b2801996305bf3d4a125576f9655ff0b63df25602f446` | added `tools: Read, Grep, Glob` |
| `security-appsec-engineer.md` | Application Security Engineer | `security/security-appsec-engineer.md` | `a19f0bda46f4adca5737365dbc3c7ed93e9d93b71349536d92ff055dcf4e3b83` | added `tools: Read, Grep, Glob` |
| `testing-accessibility-auditor.md` | Accessibility Auditor | `testing/testing-accessibility-auditor.md` | `362935907af23839775b9c6162f38c0c5a740542ab4350cb5c5b5a0d9f9a4268` | added `tools: Read, Grep, Glob` |
| `testing-performance-benchmarker.md` | Performance Benchmarker | `testing/testing-performance-benchmarker.md` | `16a841f67392d084b773c6d9f05341d093e9017f3e116f6df0de59a5a3f59c34` | added `tools: Read, Grep, Glob` |
| `testing-reality-checker.md` | Reality Checker | `testing/testing-reality-checker.md` | `6d32fcdb114233e13902ec6372d50293b120e85d490b5e81d372c29808f988a1` | added `tools: Read, Grep, Glob` |
| `engineering-frontend-developer.md` | Frontend Developer | `engineering/engineering-frontend-developer.md` | `1ae4cc10b2e0163bd3ed921ad54080b865cd02e591becd8919b64b73fab06dad` | none |
| `testing-test-automation-engineer.md` | Test Automation Engineer | `testing/testing-test-automation-engineer.md` | `4299d038e88387546d645ccbe767b1dfdb7de10da55eba1ab103149972cd2b9b` | none |

## Why these roles

| Role | Use in this repository |
|---|---|
| Software Architect (read-only) | Check a ticket's design against the module map and the independence rule in [`docs/architecture.md`](../../docs/architecture.md) and the technical specification before code is written: the shared `src/isa/` surface, the record contract, the engine contract the controller depends on. |
| Code Reviewer (read-only) | Review a diff for correctness, missed edge cases and broken rules (independence of the two CPU models, determinism, offline and loopback rules, limits). |
| Application Security Engineer (read-only) | Review the places where untrusted input meets the program: the loopback server (bind address, path handling, Host and Origin), the assembler and the trace import (size caps before storage, malformed input), and the browser rendering of that data. |
| Accessibility Auditor (read-only) | Review keyboard operation, visible focus, focus after a fault, live regions and the text description of the display, which the plan makes acceptance criteria. |
| Performance Benchmarker (read-only) | Review benchmark methodology and the chunked execution and limit behaviour in the offline release gate. It cannot run commands: the caller passes the recorded benchmark output. |
| Reality Checker (read-only) | Compare each acceptance criterion with the evidence that was actually produced before a ticket is called done. |
| Frontend Developer | Implement work in `web/`: controller, views, keyboard handling, waveform and display. |
| Test Automation Engineer | Write the `node:test` suites and fixtures in `test/` and `fixtures/`, and any later browser-walkthrough automation. |

Most of these roles are written for larger stacks. Frontend Developer and Test Automation Engineer mention frameworks, Playwright and Cypress; Application Security Engineer describes scanners and pipelines. In this repository the rules in [`CLAUDE.md`](../../CLAUDE.md) win: Node.js standard library only, plain ECMAScript modules, plain HTML, CSS and JavaScript in the browser, `node:test`, no npm packages, no external requests.

Roles that were considered and left out: Backend Architect, Database Optimizer and API Tester (there is no database or service API; the only server is a small static file server), Codebase Onboarding Engineer (there is no code to trace yet; it can be added when the first slice has merged), Technical Writer, UI Designer and UX Architect (the interface is small; Frontend Developer and Accessibility Auditor cover it, and this can be revisited).

## Name collision with user-level agents

A developer who has installed Agency Agents in `~/.claude/agents/` already has agents with the same `name:` values. Claude Code gives the project-level definition precedence, so inside this repository the copies here are used, including the read-only tool limits. The upstream names were kept on purpose so that the roles stay recognisable and can be compared with upstream.

A Claude Code session that was already running when these files were added keeps the definitions it loaded at start. Start a new session to pick up the project copies.

## Check that the roles load

From the repository root, in a new session:

```text
claude -p "List the project-level subagents defined in .claude/agents with the tools each one may use."
```

The six reviewer roles and `loop-verifier` must report exactly `Read, Grep, Glob`.

## Updating

Fetch the same paths at a newer revision, re-apply the `tools:` line to the six reviewer roles, and update the revision and hashes in this file in the same commit.

## Local change: automatic delegation (2026-11-22)

One sentence beginning "Use proactively" was appended to the `description:` line of every Agency Agents role in `.claude/agents/` (not to `loop-verifier`). Claude Code uses that field to decide when to delegate, so the roles now run during ticket work without being named. Nothing else in the role files changed.

This supersedes any statement above that a role file is unmodified or that the `tools:` line is the only local change. To compare a role with the pinned upstream file, remove that sentence (and the `tools:` line where one was added) first.

The steps at which each role runs are in `.claude/skills/implement-ticket/SKILL.md`.

A section headed "In this repository" was then inserted directly after the frontmatter of every Agency Agents role (not into `loop-verifier`), before the upstream text. It is project-specific text written for this repository, not upstream text. Because the repository has no application code yet, each section describes the planned stack, modules and commands from the technical specification and says they are planned. Each section ends with the sentence "This section and CLAUDE.md override the generic text below wherever they differ." The upstream text below it and the rest of the frontmatter are unchanged.

To compare a role with the pinned upstream file, remove the "Use proactively" sentence (and the full stop added in front of it where the upstream description has none), the section "In this repository" together with the blank line after it, and the `tools:` line where one was added. Re-check the sections against the code once it exists.

Loading check: not run in this stage (`claude -p` was skipped on purpose to spare memory). Run the command under "Check that the roles load" before relying on the roles.
