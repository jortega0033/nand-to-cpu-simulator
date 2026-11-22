---
name: implement-ticket
description: Playbook for implementing a GitHub issue in this repository from start to pull request, with the project subagents run at fixed steps. Use whenever asked to implement, start, continue or finish a ticket, an issue or an epic child, for example "implement #12" or "work on the next ticket".
argument-hint: "[issue number]"
---

# Implement a ticket

Use this playbook for every implementation ticket in this repository. `CLAUDE.md` holds the commands, the architecture boundaries, the Git workflow and the evidence rules; where this playbook and `CLAUDE.md` differ, `CLAUDE.md` wins.

The project subagents in `.claude/agents/` are part of the work. Delegate to them at the steps below without waiting to be asked. If a step names a role that is not installed, do that step yourself and say so in the pull request.

## Steps

1. **Read the ticket.** `gh issue view <number>` and the epic it belongs to. Check that every prerequisite issue is closed and that no owner decision named in the ticket is still open. If the ticket is blocked, stop and say what blocks it.
2. **Read the rules.** `CLAUDE.md`, then the architecture notes it links to.
3. **Orient and check the approach.** For a ticket that changes UI, run the `ui-ux-pro-max` skill first (design-system search for the product type) and read `docs/ui-quality.md`. Delegate as the table "Before coding" says. Settle open design questions before writing code.
4. **Branch** as the Git workflow in `CLAUDE.md` says. Never work on the default branch.
5. **Implement** inside the ticket's stated scope. Delegate the work to the implementing role that matches the files being changed (table "While coding"). Do not widen scope; note anything else you find as a follow-up.
6. **Test.** Add or change tests for every acceptance criterion and material edge case, then run the checks listed in `CLAUDE.md`. Record each command and its result. Add the line to `CHANGELOG.md` now, so the reviewers see the complete diff.
7. **Specialist review.** Run every role in the table "After coding" whose trigger matches the change.
8. **Review gate, always.** First write the reviewer inputs to `.claude/state/review/` (the diff against `origin/main`, the diff stat and the recorded command output; the reviewers have no shell), and rewrite them after every fix. Run Code Reviewer on the full diff. Fix every material finding, re-run the checks, and have the reviewer look again until no material finding is left.
9. **Acceptance gate, always.** Run Reality Checker with the ticket's acceptance criteria and the evidence you produced. Do not call the ticket done unless it passes.
10. **Copy check.** Run user-facing copy, documentation and pull request text through the `unslop` skill. For a ticket that changes UI, check the changed screens against `docs/ui-quality.md` and record the result.
11. **Draft pull request.** Only after steps 6 to 9 passed: `git push` and `gh pr create --draft` with the pull request template; the gate hook allows it only when both gate roles ran after the last code edit. Do not change agent configuration, CI or hooks in a ticket.
12. **CI.** CI runs on the draft. If it fails, fix, re-run the local checks and both gates, push. Do not poll: end the turn with "Draft pull request #N is waiting for CI" and read `gh pr checks <n>` once when woken.
13. **Ready.** When CI is green, `gh pr ready <n>` and comment on the issue with the CI run link. Do not merge: only the owner merges.

## Roles

### Before coding

| Role | Access | Delegate to it |
|---|---|---|
| Software Architect | read-only reviewer | Before implementing a ticket that adds or changes a module boundary, data model, storage schema, public API or dependency, to check the approach against the architecture notes |

### While coding

| Role | Access | Delegate to it |
|---|---|---|
| Frontend Developer | can edit | When a ticket changes browser-side code such as pages, components, client state, styling or keyboard interaction |
| Test Automation Engineer | can edit | When a ticket adds or changes tests, fixtures or a browser test harness, or when acceptance criteria need new automated checks |

### After coding

| Role | Access | Delegate to it |
|---|---|---|
| Application Security Engineer | read-only reviewer | After a ticket touches input parsing, file upload or import, sanitization, origin and host checks, or any handling of untrusted data |
| Accessibility Auditor | read-only reviewer | After a ticket changes user-facing UI, keyboard handling, focus order or markup |
| Performance Benchmarker | read-only reviewer | After a ticket with a performance budget, a benchmark or large-input behaviour |

### Gates that run on every ticket

| Role | Access | Delegate to it |
|---|---|---|
| Code Reviewer | read-only reviewer | After implementing or changing code for a ticket, before the work is called done or a pull request is opened |
| Reality Checker | read-only reviewer | As the acceptance gate of every ticket, after Code Reviewer and before the draft pull request is opened (it does not need a CI result), to check each acceptance criterion against evidence that was actually produced |

## Rules

- The session or role that wrote a change does not count as its reviewer.
- Read-only reviewers cannot run commands. Give them the diff, the acceptance criteria and the recorded command output.
- Where a role's general advice (frameworks, dependencies, cloud services) conflicts with `CLAUDE.md`, `CLAUDE.md` wins.
- In the pull request description, add a section "Agent roles run" listing each role that ran, what it was asked and its verdict, and any step you did yourself because a role was missing.
