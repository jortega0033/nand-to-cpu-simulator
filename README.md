# NAND-to-CPU Simulator

An offline project. Only the scaffold exists: the plan, technical specification, backlog, module folders and a test command (`npm test`, Node 22 or newer, no dependencies). Product behaviour has not been implemented.

## Program goal

Build a whole computer from NAND gates to a running operating system: logic, a pipelined CPU with caches and virtual memory, an assembler, linker, optimising compiler, a multitasking kernel and a game, all simulated, inspectable and proven equal layer by layer.

The program is planned ([#39](https://github.com/jortega0033/nand-to-cpu-simulator/issues/39)). Phase 1 is the current epic [#1](https://github.com/jortega0033/nand-to-cpu-simulator/issues/1) and the only phase with tickets.

**Score.** Two numbers: the share of the official RISC-V instruction tests that pass at gate level, and the instructions per second of the fast simulator that is proven equal to it.

| Phase | Content | Hours (rough) | Issue |
|---|---|---|---|
| 1 | The current epic and its tickets | 60 to 90 | [#1](https://github.com/jortega0033/nand-to-cpu-simulator/issues/1) |
| 2 | Real hardware design | 140 to 240 | [#40](https://github.com/jortega0033/nand-to-cpu-simulator/issues/40) |
| 3 | RISC-V machine | 150 to 260 | [#41](https://github.com/jortega0033/nand-to-cpu-simulator/issues/41) |
| 4 | Toolchain | 160 to 280 | [#42](https://github.com/jortega0033/nand-to-cpu-simulator/issues/42) |
| 5 | Operating system | 160 to 280 | [#43](https://github.com/jortega0033/nand-to-cpu-simulator/issues/43) |
| 6 | Speed and proof | 130 to 220 | [#44](https://github.com/jortega0033/nand-to-cpu-simulator/issues/44) |

About 800 to 1370 engineer hours in total: rough estimates, not measurements. The numbers in the score and the finish lines are targets until a run shows them. Only phase 1 has tickets to work; the sub-issues of a later phase are written when it starts. No single session is expected to reach the end.

## Plan

- [Full product plan and acceptance criteria](docs/PRD.md)
- [Technical specification and verification fixtures](docs/TECHNICAL_SPEC.md)
- [Implementation epic](https://github.com/jortega0033/nand-to-cpu-simulator/issues/1)

## Current status

The fixtures describe expected results for future checks. No working baseline or passing implementation tests are claimed. Required runtime versions and offline dependencies must be checked before the first build.

## Licensing

A license for this project has not been selected. Any upstream reference or adapted code must retain its applicable notices; see the plan.
