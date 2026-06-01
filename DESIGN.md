---
name: Stow
description: A calm, dark side-panel tab manager for Chrome where tabs sleep and stash, and nothing is ever lost.
colors:
  charcoal: "#1e1e1e"
  slate-panel: "#2a2a2a"
  hover-graphite: "#333333"
  hairline: "#3a3a3a"
  soft-white: "#e8e8e8"
  muted-gray: "#a0a0a0"
  signal-blue: "#4c9aff"
  warning-coral: "#ff6b6b"
typography:
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.06em"
  badge:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
  mono:
    fontFamily: "ui-monospace, 'Cascadia Code', monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  favicon: "3px"
  control: "4px"
  field: "5px"
  toast: "6px"
  card: "8px"
  pill: "999px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
components:
  button-secondary:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.muted-gray}"
    rounded: "{rounded.field}"
    padding: "4px 8px"
  button-secondary-hover:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.soft-white}"
  row-action:
    backgroundColor: "transparent"
    textColor: "{colors.muted-gray}"
    rounded: "{rounded.control}"
    size: "24px"
  row-action-hover:
    backgroundColor: "{colors.slate-panel}"
    textColor: "{colors.soft-white}"
  badge-active:
    backgroundColor: "transparent"
    textColor: "{colors.signal-blue}"
    rounded: "{rounded.pill}"
    padding: "1px 5px"
  input-field:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.soft-white}"
    rounded: "{rounded.field}"
    padding: "5px 8px"
  undo-toast:
    backgroundColor: "{colors.slate-panel}"
    textColor: "{colors.soft-white}"
    rounded: "{rounded.toast}"
    padding: "8px 8px 8px 12px"
---

# Design System: Stow

## 1. Overview

**Creative North Star: "The Quiet Dock"**

Stow is a dim side dock bolted to the edge of the browser. Tabs rest here when a window gets heavy: some sleep in place, some get shelved into a stash, and every one of them comes back on a click. The interface is built to feel like clearing a desk in low evening light, unhurried and reassuring, never a race against a timer. It reads as a single quiet column of rows, dense but never crowded, where the only things that catch the eye are the action you're taking right now and the state a tab is in.

The system is monochrome by construction: four steps of near-black and gray carry every surface, divider, and label, and a single blue (`signal-blue`, #4c9aff) is the lone voice of color. That blue never decorates; it marks the current selection, a live drop target, the keep-awake lock, and the undo affordance, and then it gets out of the way. One warm coral (`warning-coral`, #ff6b6b) appears only on the hover of a destructive action, as a held breath before something is removed. Depth is tonal, not cast in shadow: surfaces stack by lightness, and the only real shadow in the product belongs to the floating undo toast, because it genuinely hovers above everything else.

What this system explicitly rejects: the rounded-bubbly, emoji-strewn look of a consumer toy; the gradient-and-drop-shadow clutter of an enterprise admin console; the mismatched, zero-spacing cramp of a default browser-extension popup; and decorative motion that gets between the user and a fast action. Stow is a working tool that disappears into the task.

**Key Characteristics:**
- Monochrome surfaces, one blue accent, one coral danger signal. No third color.
- Flat by default; depth comes from three tonal grays, not shadows.
- Dense single-column rows with row actions that stay quiet until hover.
- Reversibility made visible: undo toasts, asleep tabs dimmed not deleted.
- Fixed pixel type scale tuned for a narrow side panel, not fluid headings.

## 2. Colors

A near-monochrome charcoal system where one blue is the entire chromatic budget and one coral is held in reserve for destruction.

### Primary
- **Signal Blue** (#4c9aff): The single accent and the only routine source of color. Marks the active tab badge, the keep-awake lock when engaged, drag-and-drop edge indicators and drop-target rings, focused input borders, and the Undo button. Used on a small fraction of any given screen; its rarity is what makes it legible.

### Tertiary
- **Warning Coral** (#ff6b6b): Reserved exclusively for the hover state of destructive actions (Close tab, Delete from stash). Never a resting color, never a fill, never decoration. It appears the instant before something is removed and vanishes when the pointer leaves.

### Neutral
- **Charcoal** (#1e1e1e): The base body background and the content surface behind the Open region. Also the resting background of inputs and secondary buttons.
- **Slate Panel** (#2a2a2a): The first elevation step. Backs the toolbar, the Stash region, the options sections, and the undo toast. Reads as "a panel sitting on the workspace."
- **Hover Graphite** (#333333): Row hover background and toast-button hover. The lightest interactive surface.
- **Hairline** (#3a3a3a): Every divider, border, and region separator. Thin, quiet, structural.
- **Soft White** (#e8e8e8): Primary text and titles. High contrast against charcoal (~13:1).
- **Muted Gray** (#a0a0a0): Secondary text: region headings, counts, state labels, hints, and the resting color of icon buttons. Clears ≥4.5:1 on every surface, including hover rows (4.8:1 on `hover-graphite`, ~6.2:1 at rest on charcoal); it is the contrast floor, not a lighter "elegant" gray.

### Named Rules
**The One Blue Rule.** `signal-blue` is the only accent. It is allowed to mean exactly four things: current state, live drop target, engaged lock, and undo. If blue is being used to make something look nice, that use is wrong. Remove it.

**The Coral-On-Hover-Only Rule.** `warning-coral` never appears at rest. A destructive control is muted gray until hovered, then coral. A red icon sitting idle in a row is forbidden; it cries wolf.

## 3. Typography

**Body Font:** system-ui (with -apple-system, 'Segoe UI', sans-serif)
**Label/Mono Font:** ui-monospace (with 'Cascadia Code', monospace), in the options textarea only

**Character:** One native system sans carries everything: titles, rows, labels, buttons, data. The system stack means Stow renders in the same typeface as the surrounding OS chrome, which is exactly right for a tool that should feel like part of the browser rather than a guest inside it. Hierarchy comes from size and weight, never from a second display face.

### Hierarchy
- **Title** (600, 16px, 1.5, -0.01em): The options page heading only. The side panel itself has no page title; the regions are its structure.
- **Body** (400, 13px, 1.4): Tab and stash row titles, toast messages. The workhorse size, tuned dense for a ~320px panel.
- **Label** (400, 11px, 0.06em, uppercase): Region headings ("Open", "Stash") and options section headings. Wide-tracked uppercase, used as quiet structural markers, not loud eyebrows.
- **Badge** (400, 10px, 0.04em, uppercase): Tab state badges ("Active" / "Awake" / "Asleep"). The smallest type in the system; informational, glanceable.
- **Mono** (400, 12px): The blocklist textarea in options, where URLs benefit from monospace alignment.

### Named Rules
**The System-Native Rule.** Never load a webfont. Stow borrows the OS's own UI face so it reads as part of the browser. A custom display font in this product is a tell that something is trying to be noticed; nothing here should be.

**The Rem-Sized Rule.** Express every font-size in `rem`, never `px`, so the panel honors the user's browser font-size setting (WCAG 1.4.4). The fixed sizes above are the design intent at a 16px root (13px = 0.8125rem, 11px = 0.6875rem); they scale together when the root grows. Layout padding stays in px so density holds; only type scales.

## 4. Elevation

Stow is flat by default. Depth is communicated almost entirely through tonal layering: `charcoal` is the floor, `slate-panel` is a surface resting on it, `hover-graphite` is the lightest interactive lift. Regions separate with a 1px `hairline` border, never a shadow. The single exception is the **undo toast**, which genuinely floats above the scrolling content and therefore earns a real cast shadow.

### Shadow Vocabulary
- **Floating toast** (`--shadow-toast`, `0 4px 16px rgba(0,0,0,0.4)`): The only resting shadow in the product, carried as a token rather than a raw value. Lifts the undo toast off the list so it reads as a transient overlay, not another row.
- **Drop-target ring** (`box-shadow: inset 0 0 0 2px var(--accent)`): An inset blue ring on a region while a draggable hovers over it. A state signal, not elevation.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The only outset shadow belongs to the toast, because it is the only element that truly hovers. If a card or row grows a drop shadow "to add depth," delete it and reach for the next tonal gray instead.

## 5. Components

### Buttons
- **Shape:** Gently rounded (5px / `field` radius for labeled buttons; 4px / `control` for the square icon buttons).
- **Secondary (toolbar / options):** `charcoal` background, 1px `hairline` border, `muted-gray` label. The default and only button chrome; there is no high-emphasis filled button in Stow.
- **Hover / Focus:** Border shifts to `signal-blue`, text brightens to `soft-white`. Active state nudges down 1px (`translateY(1px)`) for a tactile press.
- **Row actions:** Borderless 24px square icon buttons (≥24px for WCAG 2.5.8 target size; rows keep their ~30px height by trimming vertical padding to compensate). They rest at 0.6 opacity, rise to 0.9 when their row is hovered, and reach full opacity with a `slate-panel` background on direct hover. Disabled drops to 0.15 opacity. A toggled-on action (keep-awake lock) turns `signal-blue`.
- **Focus:** Every interactive control shows a 2px inset `signal-blue` ring on `:focus-visible` (inset so the list's overflow never clips it). Keyboard focus is never invisible.

### Chips / Badges
- **Style:** Pill shape (999px), 10px uppercase, `muted-gray` text, transparent border.
- **State:** The "Active" tab badge gains a `signal-blue` text color and a `signal-blue` 1px outline. Other states (Awake / Asleep) stay at full `muted-gray`; they are never dimmed by opacity, which would drop the label below the contrast floor. The asleep cue is carried by the row's dimmed title instead. Badges never fill; they outline.

### Cards / Containers
- **Regions (Open / Stash):** Not cards: full-width panels separated by a 2px top border and a tonal step to `slate-panel` (Stash) or held on `charcoal` (Open). Region headers carry an uppercase `label` heading plus a live count.
- **Options sections:** The one true card in the product. `slate-panel` background, 1px `hairline` border, 8px (`card`) radius, 16px padding.
- **Internal padding:** Rows 5–10px; sections 16px; headers 6×10px.

### Inputs / Fields
- **Style:** `charcoal` background, 1px `hairline` border, 5px (`field`) radius.
- **Focus:** Border shifts to `signal-blue`, native outline removed. No glow, no ring.
- **Mono variant:** The blocklist textarea uses the `mono` face for URL legibility.

### Navigation
Stow has no nav. The toolbar carries two bulk actions ("Sleep others", "Stash others") and a settings gear; everything else is direct manipulation of rows. Don't introduce tabs, breadcrumbs, or a nav rail; the two regions are the entire information architecture.

### Icons
- **Library:** lucide-react, one consistent stroked style at 11–15px. No second icon set, no filled or duotone variants. Chosen over Phosphor because lucide tree-shakes to only the icons used (~14), not a full-weight bundle.
- **State, not weight:** lucide is single-weight, so icons never carry meaning through fill or stroke weight. An engaged toggle (keep-awake lock) signals state with `signal-blue` color, not a heavier glyph.

### Tab Row (signature component)
The heart of the product. A single dense row: favicon, then a flex-growing title button (click to activate), a state badge, and a cluster of four reveal-on-hover actions (keep-awake lock, sleep, stash, close). The favicon falls back to a round globe glyph when a page has none, so a faviconless tab still reads as a page rather than an empty checkbox. Asleep rows dim their title to `muted-gray`; nothing is removed, only quieted.

## 6. Do's and Don'ts

### Do:
- **Do** keep `signal-blue` (#4c9aff) to the four meanings of the One Blue Rule: current state, live drop target, engaged lock, undo. Everything else is grayscale.
- **Do** show `warning-coral` (#ff6b6b) only on the hover of destructive controls; rest them at `muted-gray`.
- **Do** build depth from the three grays (`charcoal` → `slate-panel` → `hover-graphite`) and reserve the one outset shadow for the floating toast.
- **Do** keep row actions quiet at 0.6 opacity and surface them on hover; density should feel calm, not busy.
- **Do** make every destructive action reversible and show it (undo toast, dim-not-delete for asleep tabs).
- **Do** hold body text and labels to `soft-white` or `muted-gray`; `muted-gray` (#a0a0a0) is the contrast floor, clearing ≥4.5:1 on every surface including hover rows, not a starting point for going lighter.
- **Do** size every font in `rem` so type honors the browser font-size setting (WCAG 1.4.4); keep layout padding in px so density holds.
- **Do** give each interactive control a visible 2px inset `signal-blue` `:focus-visible` ring, and keep row-action targets at 24px or larger.
- **Do** honor `prefers-reduced-motion` by collapsing every transition to instant.

### Don't:
- **Don't** look like a consumer toy: no rounded-bubbly shapes, emoji clutter, mascots, or celebration color. This is a working tool.
- **Don't** look like an enterprise admin console: no gradients, no stacked drop shadows, no cluttered toolbars, no SaaS-dashboard chrome.
- **Don't** look like a default extension popup: no mismatched controls, no all-system-default styling without considered spacing, no zero-gap cramp.
- **Don't** add decorative motion: no slide-in choreography, no bounce, no transitions that delay a fast action. Motion conveys state only.
- **Don't** introduce a second accent hue or a filled primary button; the system is monochrome with one blue voice.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent stripe, gradient text, or glassmorphism. None belong here.
- **Don't** load a webfont; Stow renders in the system UI face on purpose.
- **Don't** signal state through icon fill or stroke weight; lucide is single-weight, so state is carried by color (`signal-blue`) and the dimmed row title.
- **Don't** dim already-muted text with opacity to convey a "quiet" state; it falls below the 4.5:1 floor. Use the defined gray plus a structural cue instead.
