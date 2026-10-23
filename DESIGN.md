# Portfolio visual system

Audience: recruiters and technical collaborators reviewing software engineering, research data workflows, and AI/data projects.

## Direction

Dark by default: charcoal surfaces (never navy), soft off-white text, cyan for actions and links, and violet for research and secondary accents. A header toggle switches to a soft light variant with no pure-white surfaces; the choice persists per browser. All colors are tokens at the top of `src/styles.css`; components use the tokens, never raw hex.

| Token          | Dark      | Light     |
| -------------- | --------- | --------- |
| `--bg`         | `#111214` | `#f3f3f0` |
| `--card`       | `#1b1c20` | `#fafaf8` |
| `--text`       | `#e9e9ec` | `#1b1c20` |
| `--muted`      | `#9ea1a8` | `#5d606a` |
| `--accent`     | `#5cc8f0` | `#07698c` |
| `--violet`     | `#a487ff` | `#6b4fd8` |

Motion: a slow drifting wave backdrop and pointer spotlight in the hero, a blinking caret on the headline, highlight numbers that count up on first view, cards that tilt toward the pointer, and animated SVG illustrations for each focus area and role. Every animation stops under `prefers-reduced-motion`. Illustrations are explanatory drawings, not screenshots or measured data.

Typography: Space Grotesk for display/headings, DM Sans for body copy, IBM Plex Mono for short category and artifact labels. System-font fallbacks keep the content readable without external fonts.

The signature interaction is a featured-project preview that switches among real application screenshots. Three featured project cards lead into a full searchable catalogue. Workflow miniatures summarize implementations where screenshots are unavailable; they do not impersonate application screens or measured results.

Experience uses the owner's supplied wording. Projects, research, and employment remain distinct. The library has search, discipline filters, visible result counts, a reset action, and an empty state. Native dialogs preserve keyboard containment, dismissal, and focus restoration. All primary links are real hyperlinks.

Responsive layouts are tested from 320px to desktop. Reduced motion disables transitions and scrolling animation. Focus indicators and small-text contrast remain part of the design rather than an optional mode.
