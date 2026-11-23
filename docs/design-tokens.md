# Design tokens

The visual system is the Pipenzo "Flow look": black page, Flow-style alpha layers, one accent (Pipenzo yellow `#FECE02`), red only for danger. Dark is the primary design; the light block is the matching light theme.

## Source and resync

- File: [`web/tokens.css`](../web/tokens.css), a byte-for-byte copy of `extension/sidepanel/tokens.css` in `jortega0033/clip-to-reel-studio` at commit `a13378ce73e5b27213c9a200fc960ec93afef054` (2026-11-21).
- Resync is a plain file copy of that one file over `web/tokens.css`. Nothing else changes. Never edit the copy here; a change belongs in the source repository.
- The file makes no external request. It names the fonts "Google Sans Flex" and "Inter" first, but this repository does not bundle them, so text falls back to the system fonts in the same variable.
- Link it before any other stylesheet: `<link rel="stylesheet" href="tokens.css">` in `web/index.html` (from #11 onward; no page exists on the scaffold yet).

## Rule

New UI uses these tokens. No new colour literals in CSS or JavaScript. Canvas and inline colours are read from the tokens:

```js
const css = getComputedStyle(document.documentElement);
const fg = css.getPropertyValue('--fg').trim();
```

A colour that is data (a pixel value, a user's chosen colour) is the only allowed literal, and the code says why in a comment. The ten rules in [ui-quality.md](ui-quality.md) still apply: yellow only on the primary action and the current-step marker (rule 8); status colours only for status, always with a word or icon.

## Light and dark

`:root` holds the light theme and sets `color-scheme: light dark`. A `prefers-color-scheme: dark` block overrides the surface, text, accent and status tokens. The operating system decides; there is no in-page switch.

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
