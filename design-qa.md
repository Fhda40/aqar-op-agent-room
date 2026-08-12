# Design QA — غرفة Company OS (asset-faithful rebuild)

## Evidence

- Source visual truth: `design/approved-company-os-room-reference.png`
- Implementation screenshot: `design/company-os-room-render-v2.png`
- Side-by-side comparison: `design/company-os-room-qa-v2.png`
- Source pixels: 1672×941
- Implementation pixels: 1666×945 from Browser/IAB
- CSS viewport: 1680×946, device scale factor 1
- State: map view, Noura selected, notebook open, Aqar Op active
- Density normalization: both sides resized to 840×472 only for the composite; originals were inspected independently with `view_image`.

## Asset inventory

Every visible non-standard material object in the reference is now a real project-local raster asset:

- Paper room background: `paper-background.png`
- Fahad, Noura, content researcher, business memory illustrations
- Spiral notebook inspector: `notebook-panel.png`
- Left navigation paper tab: `side-tab.png`
- Orbiting file note: `orbit-note.png`
- Bottom activity slip: `activity-card.png`
- Toolbar control paper: `toolbar-button.png`
- Hand-drawn agent ring: `agent-ring.png`
- Hand-drawn oval orbit: `orbit-line.png`
- Hand-drawn relationship arrow: `relationship-arrow.png`
- Hand-drawn title underline: `title-underline.png`

Text, dynamic values, and standard semantic icons remain code-native so the room stays interactive.

## Fidelity surfaces

- Fonts and typography: Aref Ruqaa carries the handwritten Arabic display hierarchy; IBM Plex Sans Arabic carries small system copy. Weight and scale preserve the reference hierarchy.
- Spacing and layout: the same left-tab / central map / right notebook / bottom slips composition is preserved. Desktop source and implementation share the same near-16:9 crop and region proportions.
- Colors and tokens: warm ivory, graphite, ochre, clay, and teal match the approved reference. No video or unrelated overlays remain.
- Image quality: all material surfaces and illustrations are generated raster assets with cleaned alpha, trimmed transparent padding, and project-local files. No CSS-drawn substitute remains for the notebook, scraps, buttons, cards, agent rings, orbit lines, arrows, or title underline.
- Copy: “غرفة Company OS” is the intentional user-requested replacement for the old title. “عقار أوب” is visibly an active project under Company OS.
- Icons: standard UI icons use one consistent stroke family and sit on real paper assets.
- Responsiveness: 1680×946, 1280×720, and 390×844 tested; no horizontal viewport overflow.
- Interaction: map/list toggle, agent selection, inspector close, add-agent flow, inherited Aqar Op assignment, and mobile menu tested.

## Comparison history

### Earlier build — blocked

- P1: notebook, tabs, notes, activity cards, toolbar buttons, agent rings, and connectors were approximated with CSS. This materially changed the approved visual language.
- P2: generated assets initially carried large transparent margins and rendered too small.

### Fixes

- Replaced all listed material surfaces with dedicated generated raster assets based on the approved reference.
- Removed chroma-key backgrounds, validated alpha coverage, trimmed transparent padding, and placed live text/controls above the assets.
- Replaced remaining CSS orbit ellipses and title borders with raster assets; reduced relationship-arrow prominence.

### Final pass — passed

- Side-by-side evidence shows the same physical-paper interface language and major composition.
- Remaining differences are intentional and required: Company OS title/project hierarchy and distinct detailed agent portraits.
- No actionable P0/P1/P2 finding remains.

## Verification

- Production build: passed.
- Browser/IAB render: passed.
- Live workspace endpoint: passed (`/api/live-state`, refreshed every 20 seconds).
- Live marketing feed: 10 sourced ideas; 3 ready for review.
- Project development feed: 3 sourced improvement proposals.
- Tasks and approvals: 3 active tasks; 4 pending approvals.
- Connected memory: 4 source files with dates and source references.
- Live view screenshot: `design/company-os-live-room-render.png`.
- List view: 4 agents.
- Add agent: “وكيل العمليات” created and inherited “عقار أوب”.
- Mobile 390×844: no horizontal overflow.
- Browser console errors: none.

final result: passed
