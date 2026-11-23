# AGENTS.md

The full repository instructions are in [CLAUDE.md](CLAUDE.md). This file repeats only what an agent needs before it reads that.

## State

Scaffold only: package manifest, module folders, smoke tests and CI exist; no product behaviour yet. Commands in `CLAUDE.md` that are not real are marked as planned and are introduced by named tickets. Do not report a planned command as working.

## Test commands

`npm test` is real (scaffold): it runs `node --test` from the repository root. Node.js standard library only; no npm packages.

## Loop conventions

- The loop runs at L1: report-only, started by hand. It proposes; it does not label, comment, close, edit source, push or merge.
- No scheduler and no loop workflow is installed. Do not add one without the owner's approval.
- See [LOOP.md](LOOP.md) for the manual command and the human gates.
