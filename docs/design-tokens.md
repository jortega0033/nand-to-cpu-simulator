# Design tokens

The visual system is the Pipenzo "Flow look": black page, Flow-style alpha layers, one accent (Pipenzo yellow `#FECE02`), red only for danger. Dark is the primary design; the light block is the matching light theme.

## Source and resync

- File: [`web/tokens.css`](../web/tokens.css), a byte-for-byte copy of `extension/sidepanel/tokens.css` in `jortega0033/clip-to-reel-studio` at commit `a13378ce73e5b27213c9a200fc960ec93afef054` (2026-11-21).
- Resync is a plain file copy of that one file over `web/tokens.css`. Nothing else changes. Never edit the copy here; a change belongs in the source repository.
- The file makes no external request. It names the fonts "Google Sans Flex" and "Inter" first, but this repository does not bundle them, so text falls back to the system fonts in the same variable.
- Link it before any other stylesheet: `<link rel="stylesheet" href="tokens.css">` in `web/index.html` (from #11 onward; no page exists on the scaffold yet). A ticket that creates a page or its static allowlist links `tokens.css` before any other stylesheet and serves it, which means adding it to the allowlist and to the allowlist test (decision 14-D4; recommended by the orchestrator, adopted under the owner's delegation of 2026-11-23).

## Rule

New UI uses these tokens. No new colour literals in CSS or JavaScript. Canvas and inline colours are read from the tokens:

```js
const css = getComputedStyle(document.documentElement);
const fg = css.getPropertyValue('--fg').trim();
```

A colour that is data (a pixel value, a user's chosen colour) is the only allowed literal, and the code says why in a comment. The ten rules in [ui-quality.md](ui-quality.md) still apply: status colours only for status, always with a word or icon. Yellow follows the decisions below. Yellow is used only for the primary action, the current-step marker and the current selection (UI rule 8); the focus ring is the stated exemption (14-D2).

## Accent, focus and themes

These decisions are entry 14 of [owner-decisions.md](owner-decisions.md). Their labels 14-D1 to 14-D4 are separate from the D1 to D10 numbers under Entry 10 there.

This document takes precedence over any comment in `web/tokens.css`, including the header comment and the inline comments on `--primary` and `--state-selected`. The header lists the primary button, the current-step node, the "your turn" chip and two dots of the source product, and does not list the current selection. The copy must stay identical to the source, so the comments are not edited here; this document wins where they differ.

- **Current selection (14-D1).** Yellow is used only for the primary action, the current-step marker and the current selection (UI rule 8). The owner decided this on 2026-11-23. How it is applied (recommended by the orchestrator, adopted under the owner's delegation of the same day): a selection uses a solid `--primary` fill with `--on-primary` text, not only a yellow border (about 1.5:1 against white on light). `--state-selected` does not mark the current selection; that is the solid `--primary` fill with `--on-primary` text. It carries a second sign that is not colour (weight, icon or text) and the existing aria attribute. Never a tint with a same-hue border and never a thick one-sided border.
- **Focus ring (14-D2).** `--focus` is a focus indicator and is exempt from the accent limit, including where it is yellow in dark. A ticket that says the focus style stays unchanged means the rule on main after the token pull request. Recommended by the orchestrator, adopted under the owner's delegation of 2026-11-23.
- **Themes (14-D3).** Contrast and no-colour-alone checks cover both the light block (`:root`) and the dark block of `tokens.css`. Recommended by the orchestrator, adopted under the owner's delegation of 2026-11-23.
- **Page status.** There is no page on main yet; `web/` holds only `tokens.css`. The placeholder page comes in #11 and the real page in #13; pages and controls added in ticket work follow these rules from the start.

## Light and dark

`:root` holds the light theme and sets `color-scheme: light dark`. A `prefers-color-scheme: dark` block overrides the surface, text, accent, focus and status tokens. The operating system decides; there is no in-page switch.

## Token names by role

- Surfaces: `--bg`, `--bg-raised`, `--surface`, `--bg-sunken`, `--hero-bg`, `--hero-border`, `--hero-chip-border`
- Text: `--fg`, `--muted`, `--faint`, `--on-hero`, `--on-hero-muted`, `--on-ink`, `--on-ink-muted`, `--on-media`
- Lines and focus: `--border`, `--hairline`, `--control-border`, `--input-border`, `--ink-border`, `--focus`, `--ring-accent`
- Accent: `--primary`, `--primary-press`, `--primary-edge`, `--on-primary`
- Status: `--success`, `--ok`, `--ok-bg`, `--warn-fg`, `--warn-bg`, `--danger`, `--danger-bg`, `--info`
- Dark block: `--ink`
- Alpha layers: `--glass`, `--glass-strong`, `--glass-border`, `--glass-highlight`, `--glass-video`, `--glass-video-border`, `--scrim`, `--ink-hover`, `--state-hover`, `--state-selected`, `--btn-secondary`, `--btn-secondary-border`
- Elevation: `--hero-shadow`, `--shadow-1`, `--shadow-2`, `--shadow-3`, `--shadow-float`, `--shadow-on-video`, `--shadow-on-video-lg`, `--blur`
- Gradients: `--grad-canvas`, `--grad-scrim-bottom`, `--grad-ink`
- Type: `--font`, `--font-display`, `--mono`
- Space and radius: `--space-1` to `--space-7`, `--radius-control`, `--radius-card`, `--radius-media`, `--radius-hero`, `--radius-chip`, `--radius-pill`
- Motion: `--dur-1` to `--dur-4`, `--ease-out`, `--ease-in-out`

Using a token does not make a pattern allowed: `--blur`, `--glass*` and the shadow tokens exist in the file, but rule 4 of [ui-quality.md](ui-quality.md) forbids blur or glass panels and a shadow on every card in this application.
