# Product

## Register

product

## Users

People who keep too many tabs open and feel the weight of it. They live in the browser all day: developers, researchers, writers, anyone whose work spreads across dozens of tabs. They reach for Stow from the Chrome side panel while mid-task, not as a destination. The job: thin out the noise of the current window without losing anything, and bring tabs back when they're needed again.

## Product Purpose

Stow is a Chrome side-panel tab manager built on two reversible verbs:

- **Sleep** discards a tab from memory while keeping it in the tab strip, so a heavy window gets lighter without anything disappearing.
- **Stash** removes a tab from the strip into a saved list, so the window clears down to what's in front of you, and stashed tabs reopen on demand.

Supporting pieces: drag-and-drop reordering between the open and stash regions, a per-tab keep-awake lock for tabs that must not sleep, bulk actions ("Sleep others" / "Stash others"), and an undo toast on every destructive action. Success is when a cluttered window becomes calm in a few clicks and the user trusts that nothing is ever truly gone.

## Brand Personality

Calm and tidy. Stow should feel like clearing a desk, not racing a stopwatch. Three words: **orderly, reassuring, quiet.** The voice is plain and unhurried. Everything is reversible, and the interface should make that safety felt: undo is always within reach, asleep tabs are dimmed but present, stashed tabs are one click from return. Restful organization over raw speed.

## Anti-references

- **Consumer / playful.** No rounded-bubbly shapes, emoji clutter, mascots, color confetti, or gamified celebration. This is a working tool, not a toy.
- **Heavy enterprise admin.** No gradients-everywhere, stacked drop shadows, cluttered toolbars, or SaaS-dashboard chrome. Density should breathe, not overwhelm.
- **Generic browser-extension popup.** No mismatched controls, all-system-default styling, or cramped zero-spacing layouts. Every control is considered and consistent.
- **Over-animated.** No decorative motion, slide-in choreography, or bouncy transitions that get between the user and a fast action.

## Design Principles

1. **Nothing is ever lost.** Every destructive action is reversible and the reversibility is visible: undo toasts, dimmed-not-deleted asleep tabs, one-click stash return. Trust is the product.
2. **The tool stays quiet.** Stow serves the task and then disappears. Chrome stays minimal, motion only ever conveys state, color is reserved for the current action and live state, not decoration.
3. **Order you can see.** The open region and the stash region are always legible at a glance. Structure (regions, state badges, drag affordances) communicates without being read.
4. **Calm density.** Show many tabs without crowding. Tight, even spacing with enough breathing room that a full window still reads as restful, not packed.
5. **Standard affordances, done well.** Use the familiar vocabulary of list rows, toggle buttons, and drag-and-drop exactly as users expect. Never reinvent a control for flavor.

## Accessibility & Inclusion

No specific external requirements. Hold to reasonable product defaults: legible contrast in the dark theme, focus-visible on interactive controls, and respect `prefers-reduced-motion` for the transitions that exist. Don't over-specify beyond what the interface actually needs.
