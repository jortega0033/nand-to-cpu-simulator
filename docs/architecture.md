# Implementer map (planned)

Status: planned. Nothing here is implemented. The behaviour is specified in [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md); this file only says where each piece is meant to live and which dependencies are allowed. Directory names are proposals; the first ticket that creates a directory may adjust it and must update this file and `CLAUDE.md`.

## Modules and allowed imports

| Module | Holds | May import |
|---|---|---|
| `src/isa/` | Instruction definitions, field layout, 16-bit and 8-bit masks, state schema, committed-record schema | nothing |
| `src/reference/` | Instruction-level reference interpreter | `src/isa/` |
| `src/circuit/` | NAND network model, validation, derived blocks, register boundary, phase clock | `src/isa/` (bit-width only) |
| `src/gate/` | Gate-derived datapath, PC control, register file, fault and halt handling | `src/isa/`, `src/circuit/` |
| `src/asm/` | Two-pass assembler, diagnostics, source-to-ROM mapping | `src/isa/`, `src/trace/limits.js` (constants only) |
| `src/trace/` | Record export, canonical hash, checkpoints, seek, limits | `src/isa/` |
| `src/compare/` | First-divergence comparator | `src/isa/`, `src/trace/` |
| `src/stub/` | Temporary replay engine for the walking skeleton, deleted when the reference interpreter lands | `src/isa/` |
| `src/server/` | Loopback static server | Node standard library only |
| `web/` | Browser files, controller, views | engine contract only, through the controller |

## Rules the layout exists to protect

- `src/reference/` and `src/gate/` never import each other, and neither imports a decode, arithmetic, branch or state-transition helper from the other or from a shared file. The shared surface is `src/isa/`: definitions and schemas only, no behaviour.
- The comparator sees both engines only through committed records.
- The browser controller owns no CPU state. It asks an engine for the next record and draws committed values. A pending write is never drawn.
- Replay from a stored trace is read-only and never calls a live engine.

## Backlog drift

GitHub epic #1 and its tickets supersede the ticket table, estimates and sequencing in the epic section of [PRD.md](PRD.md). Differences: two tickets were added (E28-0 walking skeleton, E28-7 committed records, trace export, checkpoints, replay and limits), E28-1 and E28-2 depend on E28-0, E28-5 also depends on E28-4 and E28-7, and the estimate is 30 to 45 hours instead of the table's 20 to 29. The PRD's first working slice (NAND, then adder, then the four phases) is delivered by E28-0 plus E28-1. Behaviour is not affected: [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md) still decides it. An agent stops and flags a conflict only when a ticket contradicts that behaviour, not when ticket order or estimates differ from the PRD table.

## One workflow, end to end

Assembly text or the bundled ROM, then `src/asm/`, then the loaded ROM, then an engine (reference or gate), then committed records, then `src/trace/` (export, checkpoints), then `src/compare/` (divergence) and `web/` (waveform, state, 16x16 display from RAM `0xF0` to `0xFF`).
