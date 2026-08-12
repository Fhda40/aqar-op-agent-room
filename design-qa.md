# Design QA — غرفة Company OS

## Evidence

- Source visual truth: `design/approved-company-os-room-reference.png`
- Implementation screenshot: `design/company-os-room-render.png`
- Side-by-side comparison: `design/company-os-room-qa-comparison.png`
- Source pixels: 1672×941
- Implementation pixels: 1666×945 captured from Browser/IAB
- CSS viewport: 1680×946, device scale factor 1
- State: map view, Noura selected, notebook inspector open, Aqar Op active
- Density normalization: both images resized to 840×472 for the side-by-side comparison; originals also inspected independently.

## Full-view comparison

- Information architecture matches: pinned left navigation, centered agent map, orbiting notes, right spiral notebook, and three bottom activity slips.
- The approved hand-drawn paper composition, warm ivory palette, charcoal borders, ochre/clay/teal accents, and irregular outer paper edge are preserved.
- The user-requested hierarchy is intentionally different from the source copy: the header is “غرفة Company OS” and “عقار أوب” appears as the active project under the Company OS umbrella.

## Focused comparison

- Agent portraits: four dedicated raster assets replace the reference illustrations with matching graphite/ink and watercolor treatments; transparent edges and crops were inspected.
- Inspector: project, task, progress, files, subordinate agent, and achievement sections preserve the source notebook hierarchy.
- Header: time sits on the left and view/add controls on the right, matching the source layout direction.

## Required fidelity surfaces

- Fonts and typography: Aref Ruqaa is used for expressive Arabic display text and IBM Plex Sans Arabic for system copy. Heading scale, task emphasis, and small metadata hierarchy match the reference intent.
- Spacing and layout rhythm: the desktop frame, map/notebook ratio, pinned-note spacing, bottom activity strip, and outer paper margins are aligned to the source. No horizontal overflow at 1680×946, 1280×720, or 390×844.
- Colors and tokens: ivory paper, charcoal ink, teal selected state, ochre active navigation, clay memory accent, and restrained shadows match the visual source.
- Image quality and asset fidelity: all four visible illustration assets and the paper background are project-local raster assets. No placeholder avatars remain; alpha edges and crop behavior passed inspection.
- Copy and content: visible room copy is coherent for Company OS. The only intentional above-the-fold copy deviations are the Company OS room title and the active-project seal required by the user.
- Icons: one consistent Lucide stroke family is used for navigation, files, status, and actions; sizes and alignment were checked.
- States and interactions: map/list toggle, agent selection, notebook close, add-agent form, inherited Aqar Op project assignment, mobile navigation, and empty subordinate state were tested.
- Accessibility: semantic buttons and labels are present, controls remain reachable, reduced-motion preferences are respected, and mobile viewport has no horizontal overflow.

## Comparison history

### Pass 1 — blocked

- P2: time and action controls were reversed relative to the source. Fixed by making the header grid direction explicit.
- P2: Company OS title was oversized and crowded adjacent header elements. Fixed by reducing and clamping the display size.
- P2: agent names lacked contrast over portrait art. Fixed with a restrained paper label treatment and larger portrait proportions.

### Pass 2 — passed

- Post-fix screenshot shows correct header placement, readable agent names, stronger portrait presence, matching major-region proportions, and no actionable P0/P1/P2 mismatch.
- Remaining visual differences are intentional: Company OS naming/project hierarchy and newly generated detailed portraits.

## Verification

- Production build: passed.
- Browser/IAB desktop render: passed.
- Mobile 390×844: passed with no horizontal overflow.
- List view: 4 agents rendered.
- Add-agent flow: “وكيل العمليات” created and inherited project “عقار أوب”.
- Browser console errors: none.

final result: passed
