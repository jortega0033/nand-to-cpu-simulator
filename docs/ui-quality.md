# UI quality rules

These ten rules are binding for every screen and every piece of user-facing text in this repository. Rules 1 and 2 were stated by the owner; rules 3 to 10 were approved by the owner on 2026-11-22. Enforcement is by the review gate (Code Reviewer on every ticket) and by the changed-screen check in the ticket; rule 1 can be linted, rule 2 cannot be detected reliably from CSS.

1. No thick accent border on one side of a card, callout, alert, list item or quote (for example `border-left: 4px solid <accent>`). Use spacing, type weight, an icon or a full hairline border instead.
2. No soft tinted background with a thin border of the same hue as the default way to mark a status, tag, callout or card. One neutral surface and one clear signal (text, icon or a solid chip) is enough.
3. No gradient text and no purple-to-blue gradient as a default accent.
4. No blur or glass panels, and no drop shadow plus large radius on every card.
5. No emoji used as icons or bullets, and no sparkle marks.
6. No pill or badge on things that are not states. No all-caps, letter-spaced micro labels as section decoration.
7. No centred hero with a slogan in an application screen. Screens open on the user's task.
8. One accent colour, used for the primary action and the current selection. Status colours only for status.
9. Dense, aligned layouts on a consistent spacing scale. No card grid where a table or a list is the right form.
10. User-facing copy is plain and specific: no filler, no exclamation marks, and the same word for the same thing everywhere.

## How they are applied

- A UI ticket starts with the `ui-ux-pro-max` skill (design-system search for the product type): `python .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system`. It ends with a check of every changed screen against this file, recorded in the pull request.
- User-facing copy, documentation and pull request text go through the `unslop` skill before the pull request is opened.
- In this project the lab shows proposed and committed values, status (halted, faulted, paused) and a 16x16 display. Mark them with text labels and plain type weight, not with tinted boxes, and never by colour alone.
- Colours, type, spacing and motion come from the design tokens in [design-tokens.md](design-tokens.md); new UI adds no colour literals.
- The roles Frontend Developer, Accessibility Auditor, Code Reviewer and Reality Checker name this file in their checklists.
