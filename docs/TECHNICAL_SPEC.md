# NAND-to-CPU Simulator: technical specification

Planning document. Implementation and verification remain future work.

## Technical design

### Offline runtime and ownership

Use Node.js and plain ECMAScript modules for local development and execution. Serve the browser files from a loopback-only process using the standard library. The test runner and browser load the same circuit schema, assembly fixtures, and exported trace format. The simulator and reference interpreter are independent modules. They share the stable input and state schemas, instruction definitions, and bit-width rules. They do not share decode, arithmetic, branch, or state-transition helpers. The browser shows authored lab data and passes user actions into a small controller without owning CPU state.

Use local examples authored for this project. Record provenance before adopting any outside circuit diagrams, ROMs, or program fixtures. The default lab has no package-download step. Verify installed browser and Node versions before recording portability claims. Use standard-library tests and documented keyboard steps for required verification. A local browser harness can automate those steps once its availability is checked.

### NAND-derived components and clock

- Represent logic values as bits. Build NOT, AND, OR, XOR, multiplexers, and the full adder from NAND nodes. Expose hierarchy so that a learner can inspect the expanded network or the enclosing component.
- Represent the combinational part as a directed acyclic network between inputs, memory outputs, and register outputs. Reject dangling nets, multiple drivers, and unsupported combinational feedback. Register boundaries cut feedback paths for the current phase.
- Model one full tick as low and settle, rising and commit, high observation, then falling. While low, settle the proposal using the loaded instruction and previously committed state. Rising commits all register, memory, PC, and execution-status updates together. High and falling introduce no additional state update. The full-cycle button is equivalent to the ordered phase steps. From a falling edge or the reset boundary, full-cycle step runs the complete sequence. From any in-progress phase, it finishes the current sequence through falling. A full-cycle step taken after a rising-edge commit must not commit the instruction a second time.
- Establish a deterministic initial state by asserting reset before the first rising edge. Reset clears registers, RAM, status, and the execution count, sets PC to zero, and preserves the loaded ROM. Reset takes priority over a planned write. A reset edge is an initialization event and does not count as an executed instruction. Show pre-edge proposals distinctly from committed values in the waveform.
- Compose arithmetic, logical operators, register selection, and the datapath from tested NAND-derived blocks. Use an explicit memory array primitive for the large RAM and ROM rather than expanding every cell into gates. Each tick declares at most one RAM access. Export the resulting committed state, memory write, and display change through one event contract.

### ISA and state contract

All data words and registers are 16 bits. There are four registers R0–R3, an unsigned 8-bit PC, 256 words of read-only program ROM, and 256 words of separate data RAM. Assembly addresses are word addresses. An instruction is one word. The PC advances by one word modulo 256 for ordinary operations, unless a taken branch supplies a new address. Fetch from a ROM address beyond the loaded program raises a fault. ROM and RAM use separate address spaces.

Bits 15–12 select the opcode. Bits 11–10 select the first register when used. Bits 9–8 select the second register for register-to-register instructions. The low eight bits hold an immediate or word address when used. Every unused bit must be zero. Hex words in fixtures use four digits.

| Opcode | Form | Committed effect |
|---|---|---|
| 0x1 | MOVI Rd, imm8 | Zero-extend the immediate into Rd. |
| 0x2 | ADD Rd, Rs | Set Rd to the low 16 bits of Rd + Rs. |
| 0x3 | NAND Rd, Rs | Set Rd to the bitwise NAND of the operands within 16 bits. |
| 0x4 | LD Rd, addr8 | Read the addressed RAM word into Rd. |
| 0x5 | ST Rs, addr8 | Write the pre-edge value of Rs to the addressed RAM word. |
| 0x6 | JMP addr8 | Set PC to addr8 on the commit edge. |
| 0x8 | BZ Rs, addr8 | Set PC to addr8 when Rs is zero. Otherwise advance normally. |
| 0xF | HALT | Set execution status to halted and hold PC, registers, and RAM. The full tick counts once. |

For unused opcodes or invalid reserved bits, record a fault with the PC, instruction word when present, and stable reason. A failed fetch or decode records the fault on its commit edge and increments the instruction-boundary counter once. It holds PC, registers, and RAM. The next attempt to advance a halted or faulted CPU returns its current state without increasing the counter until reset. Reaching the run budget pauses the simulator with the last valid snapshot and a distinct status. A user can resume with more budget.

RAM addresses 0xF0–0xFF map to display rows 0–15. In each row, bit 15 is the leftmost pixel and bit 0 is the rightmost. Display writes are ordinary RAM writes. The browser draws from committed RAM and must not display a pending write. Pixel (11,0) corresponds to bit 4 of RAM 0xF0. The accessible text view reports the same committed row word and lit pixel coordinates.

### Assembler, inspection, and bounds

The two-pass assembler resolves ASCII labels within one file, validates the range of operands, and gives stable line-and-column diagnostics. Accept hexadecimal and decimal literals and comments beginning with a semicolon in authored program text. Declared source grammar excludes file includes, expressions, and macro expansion. Reject unknown opcodes, incorrect arity, invalid registers, duplicate and undefined labels, negative or out-of-range values, and programs longer than 256 words. Invalid assembly leaves the last loaded ROM and committed state usable. The UI keeps an editable source buffer separate from the loaded program and shows when the two differ.

Each committed record contains version, boundary count, instruction address, fetched word if present, PC after commit, R0–R3, at most one RAM write, and status. Use fixed field order and unsigned normalized data values. Keep a full RAM snapshot at reset plus periodic checkpoints, and restore display and memory deterministically on seek from the nearest checkpoint. Separate read-only replay from live execution. The inspector exposes phase, selected nets, register values, the original source line when mapped, and an actionable divergence message with expected and actual fields.

Start with a 256-word program limit, 16 KiB source limit, 10,000 committed boundaries per run, 4 MiB exported trace limit, and a selected-net cap of 32 waveform rows. Detect exceeded limits before adding oversized stored records. Chunk continuous execution to keep the UI responsive. Keep the render cadence independent of simulated time, and report paused or trace-limit states explicitly.

## Deterministic fixtures and verification

The finite circuit fixtures cover all four NAND input combinations, every one-bit full-adder input with carry, a 16-bit carry across bit 3 to bit 4, and 16-bit overflow. The hand calculation for 0xFFFF + 0x0001 is 0x10000 before masking and 0x0000 in the destination. The register-fixture trace changes the proposed input while low, holds the old register output before rising, and observes exactly one committed transition after rising.

Use this separately specified ROM for the first complete walkthrough. These results follow from the instruction rules. Measurements and actual implementation checks remain pending.

| PC | Expected word | Instruction | Expected result after commit |
|---|---:|---|---|
| 00 | 100F | MOVI R0, 0x0F | R0 = 000F, next PC 01. |
| 01 | 1401 | MOVI R1, 0x01 | R1 = 0001, next PC 02. |
| 02 | 2100 | ADD R0, R1 | R0 = 0010, next PC 03. |
| 03 | 3A00 | NAND R2, R2 | R2 = FFFF, next PC 04. |
| 04 | 2900 | ADD R2, R1 | R2 = 0000, next PC 05. |
| 05 | 8807 | BZ R2, WRITE | Branch to PC 07. |
| 06 | 10A5 | MOVI R0, 0xA5 | This instruction is skipped. |
| 07 | 50F0 | WRITE: ST R0, 0xF0 | RAM F0 = 0010, pixel (11,0) lit, next PC 08. |
| 08 | 4CF0 | LD R3, 0xF0 | R3 = 0010, next PC 09. |
| 09 | F000 | HALT | Halted at PC 09. |

The initial snapshot has boundary zero after reset. The display changes at boundary seven. The fixture halts at boundary nine with R0–R3 = 0010, 0001, 0000, 0010. Compare all 256 RAM words at selected checkpoints, plus every write and the complete architectural state at each commit. Add separate fixtures for a nonzero conditional branch, a jump loop that reaches budget, reset overriding a pending store, a load immediately after a store, and edge addresses 00/FF. For a negative machine fixture, start with 2001 at PC 00. The low reserved bit must trigger a decode fault at boundary one while preserving zero registers and RAM. Inject a different display write into a copied reference trace and require the comparator to report boundary seven and RAM F0 as the first difference.

Compare the first run and a fresh reset run using canonical output hashes. Test both full-tick and phase-step paths for the same committed results. Include keyboard traversal, visible focus, pause, resume and reset in the offline browser test. A benchmark records committed cycles per second, peak memory, runtime, loaded program, and probe count after an explicit warm-up. Report the gate and reference interpreter separately with UI rendering paused for the headless timing. Evaluate a fast mode only after measuring a reproducible baseline.
