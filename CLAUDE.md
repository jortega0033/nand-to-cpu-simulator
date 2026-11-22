# CLAUDE.md

Instructions for coding agents working in this repository. Read this first, then the documents it links to.

## State of the repository

Planning only. There is no application code, no `package.json`, no test and no CI result yet. Everything below that describes a command, a directory or a module is **planned**: it is what the plan and the technical specification call for, and it becomes real only when the named ticket merges. Do not report a planned command as working, and do not claim a check passed unless you ran it.

## Product

An offline, original teaching simulator in Node.js. A learner follows a program from NAND gates through a 16-bit ripple adder, a 16-bit instructional CPU and an assembler to a 16x16 monochrome browser display. A gate-derived CPU is compared with an independently written reference interpreter, and the first divergent instruction boundary is reported.

## Source of truth

| Document | What it settles |
|---|---|
| [docs/PRD.md](docs/PRD.md) | Product requirements, first working slice, epic success, scope, epic E28 and its tickets. |
| [docs/TECHNICAL_SPEC.md](docs/TECHNICAL_SPEC.md) | Runtime and ownership, NAND-derived components and clock, ISA and state contract, assembler, record format, bounds, fixtures and the first-walkthrough ROM. |
| [docs/architecture.md](docs/architecture.md) | Planned implementer map: modules, dependency direction, what is shared and what must stay independent. |
| GitHub epic #1 and its tickets | The current backlog: scope, dependencies, acceptance criteria and estimates. A ticket refines the documents above. Epic #1 supersedes the PRD's ticket table, estimates and sequencing (see "Backlog drift" in [docs/architecture.md](docs/architecture.md)); a ticket that contradicts the *behaviour* in the technical specification is different: stop and flag it in the issue. |

Numbers in the fixtures (words, boundaries, pixel (11,0), limits) are acceptance targets taken from the technical specification. They are not evidence that anything works.

## Stack and constraints (from the technical specification)

- Node.js, plain ECMAScript modules (`.js` with `"type": "module"`), standard library only. No npm package, no bundler, no build step, no TypeScript, no CDN reference. The default lab has no package-download step.
- The browser files are served by a loopback-only process written with the Node standard library (bind `127.0.0.1`). The default browser experience makes no external request.
- Tests use the standard library (`node:test`, `node:assert`). Verified browser behaviour follows documented keyboard steps; a local browser harness is allowed only after its availability is checked and it adds no package dependency.
- The gate-derived CPU and the reference interpreter are independent modules. They share only the input and state schemas, the instruction definitions and the bit-width rules. They must not share decode, arithmetic, branch or state-transition helpers.
- The browser shows authored lab data and sends user actions to a small controller. The browser does not own CPU state.
- Authored content only: examples, circuits, ROMs and fixtures are written for this project. Record provenance before adopting anything from outside. No existing game assets, no matching proprietary interface.
- Determinism: fixed field order, unsigned normalized values, canonical output hashes equal across two fresh resets.
- Limits to enforce, detected before oversized records are stored: 256 words per program, 16 KiB source, 10,000 committed boundaries per run, 4 MiB exported trace, 32 waveform rows. Continuous execution runs in chunks so the UI stays responsive; rendering cadence is independent of simulated time.
- Node and browser versions are not pinned. The walking-skeleton ticket records the versions actually used; do not claim portability beyond them.

## Commands (all planned)

Nothing here runs today. Names are proposed by the plan; the ticket that introduces a command may adjust the name and must then update this table in the same pull request.

| Purpose | Command | Introduced by |
|---|---|---|
| Setup | none: no install step. Check `node --version`. | E28-0 walking skeleton (new ticket) records the version |
| Test | `npm test` (runs `node --test`) | E28-0 makes it real; every later ticket extends it |
| Run the lab | `npm start` (runs `node src/server/main.js`, binds `127.0.0.1`) | E28-0 |
| Circuit suite | `node --test "test/circuit/**/*.test.js"` | E28-1 (#2) |
| ISA and reference checks | `node --test "test/isa/**/*.test.js" "test/reference/**/*.test.js"` | E28-2 (#3) |
| Gate CPU and comparator checks | `node --test "test/gate/**/*.test.js" "test/compare/**/*.test.js"` | E28-3 (#4) |
| Assemble a file | `node src/asm/cli.js <file.asm>` | E28-4 (#5) |
| Trace, replay and limits checks | `node --test "test/trace/**/*.test.js"` | E28-7 (new ticket) |
| Offline walkthrough | `node scripts/walkthrough.js` | E28-6 (#7) |
| Benchmark | `node scripts/bench.js` | E28-6 (#7) |

## Planned layout

Short version; the detail and the dependency rules are in [docs/architecture.md](docs/architecture.md).

- `src/isa/`: instruction definitions, bit-width rules, state and record schemas (the only code both CPU models may import).
- `src/reference/`: instruction-level reference interpreter.
- `src/circuit/`, `src/gate/`: NAND network, derived blocks, clock and register boundary; the gate-derived datapath and CPU.
- `src/asm/`: two-pass assembler, diagnostics, source mapping, command line.
- `src/trace/`: committed records, export, canonical hash, checkpoints, seek, limits.
- `src/compare/`: boundary-by-boundary comparator and divergence report.
- `src/server/`: loopback static server. `web/`: browser files and the controller. `fixtures/`: circuit schema, assembly and trace fixtures. `test/`: tests. `scripts/`: walkthrough and benchmark.

## Git workflow

- Never work on `main`. One branch per ticket, named `ticket/<issue-number>-<short-slug>`, from the current `origin/main`.
- Small commits with an imperative subject. Open a pull request to `main` that names the issue (`Closes #N`). Only the owner merges and releases. Do not push to `main`, force-push, merge, tag or publish.
- Stay inside the ticket's stated scope. Note anything else you find as a follow-up in the pull request instead of widening the change.
- Documentation-only and planning changes follow the same branch and pull-request rule.

## Evidence before a ticket is called done

Capture, in the pull request description, each command you ran and its observed result:

1. The test command, plus every check the ticket's verification section lists, run locally and passing. For a planned command that does not exist yet, the ticket that introduces it must make it real in the same pull request.
2. Each acceptance criterion mapped to the test, fixture or manual step that proves it. A criterion that needs a person (a keyboard walkthrough in a normal browser) is done as far as an agent can and the rest is listed under "Owner checks"; say which.
3. Determinism and offline checks the ticket touches: canonical hash equal across two fresh resets, no external request.
4. A statement of what was not run or not verified.
5. Review gates, in this order: local checks pass; Code Reviewer reviews the full diff and the recorded output; Reality Checker compares each criterion with the evidence (the reviewers have no shell, so write the ticket text (output of `gh issue view <n>`, including the acceptance criteria), the diff stat, the diff and the check outputs to `.claude/state/review/` and name them in the request); only then open the draft pull request. CI runs on the draft; fix and re-run both gates on a red result. Do not poll CI: bind the pull request to the session when the app offers it and end the turn with "Draft pull request #N is waiting for CI"; read `gh pr checks <n>` once when woken. Mark it ready only when CI is green (the driver checks this; Reality Checker does not need a CI result). CI is installed outside the tickets; until the walking-skeleton ticket adds `package.json`, CI skips `npm test` through a guard (`if: hashFiles('package.json') != ''`). The guard turns itself off once `package.json` exists, so no ticket edits CI; only the owner may later delete the `if:` line.
6. For a ticket that changes UI: the changed screens were checked against `docs/ui-quality.md`. User-facing copy and docs went through the `unslop` skill.

Never write "done", "passing" or "verified" without the command and its output.

## Delivery workflow

- **Start:** only the owner starts ticket work, with `/next-ticket [issue]`, which picks leaf tickets only (a `tracking` parent or a ticket with open sub-issues is never picked; the pull request of a parent's last open sub-issue also says `Closes #<parent>`) ([`.claude/skills/next-ticket/SKILL.md`](.claude/skills/next-ticket/SKILL.md)). There is no scheduler. Playbook: [`.claude/skills/implement-ticket/SKILL.md`](.claude/skills/implement-ticket/SKILL.md).
- **Review gate hook:** [`.claude/hooks/role-gate.mjs`](.claude/hooks/role-gate.mjs) blocks `gh pr create` and `gh pr ready` until Code Reviewer and Reality Checker ran after the last code edit. `ROLE_GATE=off` in the environment Claude Code is started from switches it off for that session; only the owner does that.
- **Permissions:** [`.claude/settings.json`](.claude/settings.json). Documented commands are allowed; force pushes, pushes to `main`, merges, releases and reads of secrets are denied; edits to CI, agent configuration and Loop files ask first.
- **CI:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on Linux and Windows and must be green before a pull request is marked ready. Until E28-0 (walking skeleton) adds `package.json`, a guard skips `npm test`; the guard becomes inactive on its own at that point, and only the owner may later delete the `if:` line. No ticket changes `.github/`.
- **Pull requests and tickets:** [pull request template](.github/pull_request_template.md), [ticket template](.github/ISSUE_TEMPLATE/implementation-ticket.md). Labels: `status:ready`, `status:blocked`, `status:in-progress`, `needs-decision`, `tracking`. Add a line to [CHANGELOG.md](CHANGELOG.md) in every ticket pull request.
- **Only the owner merges and releases** ([docs/RELEASING.md](docs/RELEASING.md)). Security reports: [SECURITY.md](SECURITY.md).
- **UI and writing quality:** [docs/ui-quality.md](docs/ui-quality.md) is binding for every screen; skills `ui-ux-pro-max` (UI work) and `unslop` (copy, docs, pull request text) are installed in `.claude/skills/`.
- **Owner decisions** are recorded in [docs/owner-decisions.md](docs/owner-decisions.md). An agent that finds one blocking a ticket stops and says so.

## Loop

Loop Engineering is installed at L1, report-only, unscheduled. See [LOOP.md](LOOP.md). Ticket work is not a loop run.

## Ticket implementation: agent roles run automatically

The project subagents live in `.claude/agents/`: Agency Agents roles at a pinned revision, with provenance and local changes in [.claude/agency-agents/README.md](.claude/agency-agents/README.md). Each role file starts with an "In this repository" section written for this project (planned stack, modules and commands, marked as planned until the code exists). Reviewer roles are read-only (`tools: Read, Grep, Glob`): the driver (`/next-ticket` step 4.2 or the playbook) writes the diff stat, the diff against `origin/main`, the acceptance criteria and the check outputs to `.claude/state/review/` and names those files in the request; the reviewers read the diff and evidence from there.

When asked to implement, continue or finish a GitHub issue, follow the playbook in [`.claude/skills/implement-ticket/SKILL.md`](.claude/skills/implement-ticket/SKILL.md). Claude Code loads it on its own for ticket work; `/implement-ticket <issue number>` starts it by hand.

Delegate to the project subagents in `.claude/agents/` without waiting to be asked:

- **Before coding:** Software Architect, as their descriptions say.
- **While coding:** the implementing role that matches the files being changed.
- **After coding:** each specialist reviewer whose trigger matches the change.
- **On every ticket, before it is called done:** Code Reviewer, then Reality Checker.
- The session that wrote a change does not count as its reviewer.
- List the roles that ran and their verdicts in the pull request description under "Agent roles run".

Each role's `description` ends with a "Use proactively ..." sentence, which is what makes Claude Code delegate to it without being told.
