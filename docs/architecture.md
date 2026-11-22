# Implementer map (planned)

Status: planned. Nothing here is implemented. The behaviour is specified in [TECHNICAL_SPEC.md](TECHNICAL_SPEC.md); this file only says where each piece is meant to live and which dependencies are allowed. Directory names are proposals; the first ticket that creates a directory may adjust it and must update this file and `CLAUDE.md`.

## Modules and allowed imports

| Module | Holds | May import |
|---|---|---|
| `src/isa/` | Instruction definitions, field layout, 16-bit and 8-bit masks, state schema, committed-record schema | nothing |
| `src/reference/` | Instruction-level reference interpreter | `src/isa/` |
| `src/circuit/` | NAND network model, validation, derived blocks, register boundary, phase clock | `src/isa/` (bit-width only) |
| `src/gate/` | Gate-derived datapath, PC control, register file, fault and halt handling | `src/isa/`, `src/circuit/` |
| `src/asm/` | Two-pass assembler, diagnostics, source-to-ROM mapping | `src/isa/` |
| `src/trace/` | Record export, canonical hash, checkpoints, seek, limits | `src/isa/` |
| `src/compare/` | First-divergence comparator | `src/isa/`, `src/trace/` |
| `src/server/` | Loopback static server | Node standard library only |
| `web/` | Browser files, controller, views | engine contract only, through the controller |

## Rules the layout exists to protect

- `src/reference/` and `src/gate/` never import each other, and neither imports a decode, arithmetic, branch or state-transition helper from the other or from a shared file. The shared surface is `src/isa/`: definitions and schemas only, no behaviour.
- The comparator sees both engines only through committed records.
- The browser controller owns no CPU state. It asks an engine for the next record and draws committed values. A pending write is never drawn.
- Replay from a stored trace is read-only and never calls a live engine.

## One workflow, end to end

Assembly text or the bundled ROM, then `src/asm/`, then the loaded ROM, then an engine (reference or gate), then committed records, then `src/trace/` (export, checkpoints), then `src/compare/` (divergence) and `web/` (waveform, state, 16x16 display from RAM `0xF0` to `0xFF`).
