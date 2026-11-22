# METEOR AI — Master UI Build Prompt

> **Product:** Meteor AI  
> **Company:** Abstraction  
> **Mission of this prompt:** Build the complete front-end (visual layer + all screens + interactions) of Meteor AI using the **Astryx Design** system, taking **Muse AI** as the visual and UX inspiration, following the attached reference images as closely as possible.

---

## 0. READ THIS FIRST — ROLE, RULES OF ENGAGEMENT

You are a senior product designer + staff front-end engineer working as one person. You are building the entire user interface of **Meteor AI**, an AI product by the company **Abstraction**. The result must feel like a shipped, premium, 2026-grade AI product — not a template, not a tutorial, not a prototype.

**Non-negotiable rules**

1. **Follow the reference images.** I will attach screenshots/visual references of **Muse AI**. Treat them as the source of truth for layout, density, spacing rhythm, proportion, hierarchy, typography feel, radius, motion feel, and overall "mood". When this document and the images disagree on something *visual*, **the images win**. When they disagree on *product naming/branding*, **this document wins** (the product is Meteor AI, never "Muse").
2. **Do not copy Muse's brand.** Inspiration ≠ cloning. No Muse logo, name, copy, illustrations or trademarks. Replace everything with Meteor AI / Abstraction identity (see §3).
3. **Use the Astryx Design system for everything.** No ad-hoc component libraries (no shadcn, MUI, Chakra, Ant, Radix-styled kits, Tailwind UI, etc.) unless Astryx explicitly has no equivalent — in that case build the missing piece **on top of Astryx tokens + StyleX**, and document it (§4.5).
4. **Quality bar = "perfect".** Pixel-aligned, consistent, accessible, responsive, with real states (hover, focus, active, disabled, loading, empty, error, success). No lorem ipsum in final screens (use believable, on-brand copy). No placeholder gray boxes in the final result.
5. **Be complex and complete.** I want many screens, many components, rich interactions. Do not stop at a landing page and a chat box. Build the full product surface described in §6–§9.
6. **Work autonomously, then show me.** Build the app, run it, take screenshots of every major screen/state (§12) and deliver them so I can review visually. Do not ask me clarifying questions unless something is truly blocking; make a strong decision, note it, and continue.
7. **Be honest.** If something doesn't work, can't be done, or you deviated from the reference, say so explicitly in the final report. Never claim a screen is finished if it isn't.

---

## 1. STEP ZERO — INSTALL ASTRYX DESIGN (MANDATORY, DO THIS BEFORE ANYTHING ELSE)

Do exactly this, in this order, before writing any UI code:

> **Install @astryxdesign/core, @stylexjs/stylex, @astryxdesign/theme-neutral, and @astryxdesign/cli in this project, then run `npx @astryxdesign/cli init` to set up agent docs. Read the generated files to learn the conventions.**

Concretely:

1. Install these four packages in the project (use the project's existing package manager; if none, use `npm`):
   - `@astryxdesign/core`
   - `@stylexjs/stylex`
   - `@astryxdesign/theme-neutral`
   - `@astryxdesign/cli`
2. Run: `npx @astryxdesign/cli init`
3. **Read every file the CLI generates** (agent docs, conventions, component docs, token docs, theming docs, CLAUDE.md / AGENTS.md-style files, etc.). Read them fully — not just the titles.
4. Configure the StyleX build integration exactly as the generated docs instruct (Babel/Vite/Next/webpack/SWC plugin, whichever applies to the chosen framework). Verify that a trivial Astryx component renders with correct styles before proceeding.
5. Write a short `docs/ASTRYX_CONVENTIONS.md` summarizing, **in your own words**, the conventions you learned (how to import components, how to style with StyleX, how tokens/themes work, how to compose, naming rules, do/don't). This file is your own cheat sheet and proves you read the docs. Keep it under ~150 lines.
6. From this point on, **every component choice must follow those generated conventions.** If the docs say "use X component for Y", use it. If the docs forbid a pattern, don't use it.

> If the CLI output or docs conflict with anything in this prompt about *how to use Astryx*, **the Astryx docs win.** If they conflict about *what to build or how it should look*, this prompt + the reference images win.

---

## 2. TECH STACK & PROJECT SETUP

Unless the existing repo already dictates otherwise, use:

- **Framework:** React 18+ with **TypeScript (strict)**. Prefer **Next.js (App Router)** or **Vite + React Router** — pick whichever integrates StyleX most cleanly per the Astryx docs, and state your choice.
- **Styling:** **StyleX** (`@stylexjs/stylex`) + **Astryx tokens**. No Tailwind, no CSS-in-JS runtime libs, no global CSS except a minimal reset/theme bootstrap.
- **Design system:** `@astryxdesign/core` + `@astryxdesign/theme-neutral` as the base theme, then a **Meteor theme layer** on top (§3.4) that overrides tokens — not components.
- **State:** lightweight (React state/context + `zustand` is acceptable). All data is **mocked** locally (typed fixtures + simulated latency + simulated streaming). No real backend required.
- **Icons:** use Astryx's icon set if provided; otherwise `lucide-react`, normalized to one stroke width and size scale.
- **Motion:** CSS/StyleX transitions first; `framer-motion` / `motion` only where truly needed (page transitions, layout animations, streaming reveal). Always respect `prefers-reduced-motion`.
- **Fonts:** self-host or use `next/font`/`@fontsource`. See §3.2.
- **Project structure** (adapt to framework):

```
src/
  app/ or routes/            # routes / pages
  components/
    primitives/              # thin wrappers/extensions over Astryx
    meteor/                  # Meteor-specific composite components
    layout/                  # shells, sidebars, panels
  features/
    chat/ studio/ library/ agents/ workspace/ settings/ onboarding/ billing/ ...
  theme/
    meteorTheme.stylex.ts    # token overrides
    tokens.ts
  mocks/                     # typed fixtures + fake streaming
  lib/ hooks/ utils/
docs/
  ASTRYX_CONVENTIONS.md
  DESIGN_DECISIONS.md        # decisions + deviations from reference
  screenshots/               # all delivered screenshots (§12)
```

- Provide `npm run dev`, `build`, `lint`, `typecheck`. Everything must pass `typecheck` and `lint` with **zero errors** before you deliver.

---

## 3. BRAND, VISUAL LANGUAGE & DESIGN TOKENS

### 3.1 Brand essence — "Meteor AI by Abstraction"

- **Personality:** fast, luminous, calm-confident, intelligent, a little cosmic. Premium and quiet — never loud, never gimmicky.
- **Metaphor:** a meteor = a bright streak of speed + insight across a calm dark/neutral sky. Use it **sparingly** as a brand motif: a subtle comet-trail gradient, a small streak in the logo, a soft glow on the primary action. **Never** use clip-art stars/galaxies/emoji rockets.
- **Tone of copy:** concise, human, confident. Short sentences. No hype words ("revolutionary", "supercharge", "unleash"). Good example: *"Ask anything. Meteor will take it from here."*
- **Company mark:** a discreet "by Abstraction" lockup appears in the sidebar footer, About modal, onboarding, and login. Abstraction's own mark is minimal and typographic.

### 3.2 Typography

- Pick a refined modern sans for UI (e.g., **Inter / Geist / Manrope / Satoshi-like** — match the *feel* of the Muse references) and a **distinct display face** for hero headlines and select marketing moments (a high-contrast serif or a characterful grotesk, *only if* the references show a similar pairing). Optional mono for code/IDs (Geist Mono / JetBrains Mono).
- Define a full type scale as tokens: `display-xl, display-lg, h1, h2, h3, h4, body-lg, body, body-sm, caption, overline, code`. Include line-height, letter-spacing, and weight per step.
- Tabular numerals for all numeric UI (usage, billing, stats, tables).
- Optical details: slightly negative tracking on large headings, slightly positive on overline/caps, `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

### 3.3 Color system (map to Astryx tokens)

Build a semantic palette driven by tokens — **never hard-code hex values in components**.

- **Neutrals:** a 12-step neutral ramp (start from `@astryxdesign/theme-neutral`) for backgrounds, surfaces, borders, text.
- **Brand accent ("Meteor glow"):** one primary accent hue family (choose based on the reference images' mood; default suggestion: a luminous violet-to-cyan gradient pair used *very* sparingly, plus a solid accent for focus/selection). Provide ramps 50–950.
- **Semantic:** success, warning, danger, info — each with `bg / border / text / solid` roles.
- **Roles to define:** `bg.canvas, bg.subtle, bg.surface, bg.raised, bg.overlay, bg.inverse, fg.default, fg.muted, fg.subtle, fg.disabled, fg.onAccent, border.subtle, border.default, border.strong, focusRing, selection, scrim`, plus `accent.solid/soft/text`, and chart categorical colors (8 colorblind-safe hues).
- **Light + Dark mode are both mandatory**, fully designed (not an inverted afterthought). Provide a **System / Light / Dark** switch persisted in `localStorage`, with no flash-of-wrong-theme on load. Also design a **third "Midnight" high-contrast dark variant** for the studio/canvas surfaces if the references suggest it.
- **Gradients:** define named gradient tokens (`meteorTrail`, `auroraSoft`, `glowRadial`). Used for: logo streak, primary CTA hover glow, hero backdrop, empty-state illustrations, generation progress. Keep noise/grain optional and subtle.

### 3.4 Meteor theme layer

Create `theme/meteorTheme.stylex.ts` that **extends/overrides `@astryxdesign/theme-neutral`** tokens (colors, radius, shadow, typography, spacing density, motion). Components must keep using Astryx components; the Meteor identity comes from **tokens**, not from forking components.

### 3.5 Shape, depth, spacing, motion (match the references)

- **Radius scale:** `xs 6 / sm 8 / md 12 / lg 16 / xl 20 / 2xl 28 / pill 999`. Match the roundedness seen in the Muse references (cards, inputs, chat bubbles, pills).
- **Elevation:** 0–5 levels using layered, low-opacity, slightly tinted shadows + 1px inner highlight on dark surfaces. Define tokens `shadow.xs … shadow.xl`, `shadow.glow`.
- **Borders:** hairline 1px, low-contrast; strong borders only for focus/selected.
- **Spacing:** 4px base grid; scale `0,2,4,6,8,12,16,20,24,32,40,48,64,80,96,128`. Consistent section rhythm.
- **Glass/blur:** use backdrop-blur *only* where the references do (floating composer, command palette, popovers, top bars) with a solid fallback.
- **Motion tokens:** durations `instant 80 / fast 140 / base 220 / slow 360 / hero 600ms`; easings `standard, emphasized, decelerate, accelerate, spring`. Reduced-motion variants for everything.
- **Micro-interactions required:** button press scale (0.98), hover lift on cards, focus ring animation, tab underline slide, sidebar collapse, message "arrive" animation, streaming caret, skeleton shimmer, toast slide, modal scale-fade, popover origin-aware transform, drag-and-drop ghosting, success check draw, copy→check morph.

---

## 4. HOW TO USE THE REFERENCE IMAGES (MUSE AI)

I will attach images of **Muse AI**. Before building, do a **Reference Analysis** pass and write the results to `docs/DESIGN_DECISIONS.md`:

### 4.1 Analyze each reference image and extract

- **Layout skeleton:** columns, panel widths (px/%), header height, sidebar width (expanded/collapsed), content max-width, gutters, grid.
- **Spacing rhythm:** the vertical/horizontal rhythm; typical paddings of cards, inputs, list items, section gaps.
- **Typography:** perceived font categories, sizes, weights, tracking, case usage, how headings differ from body.
- **Color mood:** background tones, surface layering, accent usage frequency, border contrast, how "quiet" or "vivid" it is.
- **Component inventory:** every distinct component visible (buttons, chips, inputs, composers, tabs, cards, menus, toggles, avatars, badges, tooltips, empty states, etc.) and its states.
- **Interaction hints:** hover/selected/active styling, floating elements, sticky areas, scroll behavior, overlays.
- **Iconography:** stroke weight, corner style, size.
- **Imagery & illustration:** style, treatment, masks, gradients.

### 4.2 Reference-fidelity rules

- Recreate **the same information architecture and screen composition** shown in the references for each equivalent screen.
- Match proportions within a tight tolerance: if the sidebar in the reference is ~15% of width, yours must be visually the same ratio. Overlay mentally with the reference and correct drift.
- Where the references show a screen but not a state (e.g., loading/error), extrapolate **in the same visual language**.
- Where the references don't cover a screen listed in §6–§9, design it so it is **indistinguishable in style** from the reference screens (same radii, density, tone, motion).
- After building each major screen, **compare side-by-side with the closest reference** and fix discrepancies. Record unresolved deviations in `docs/DESIGN_DECISIONS.md` under "Known deviations".

### 4.3 What to improve (while staying faithful)

Fidelity first; then quietly upgrade: better accessibility (contrast, focus, ARIA), real empty/error states, better responsiveness, better dark-mode fidelity, smoother motion. Never at the expense of the reference's look & feel.

### 4.4 What NOT to do

- Don't import/hot-link Muse assets. Recreate with Meteor identity.
- Don't invent a different layout "because it's cooler".
- Don't flatten the references into a generic dashboard template.

### 4.5 Gaps in Astryx

If Astryx lacks a component the references need (e.g., a rich chat composer, node canvas, timeline scrubber, multi-pane resizable layout), build it as a **Meteor composite** in `components/meteor/`, composed from Astryx primitives + StyleX + Astryx tokens, following the same API conventions as Astryx components (props naming, slots, variants, sizes, a11y). List every such custom component in `docs/DESIGN_DECISIONS.md` with justification.

---

## 5. GLOBAL APP ARCHITECTURE & SHELL

### 5.1 App shell (authenticated)

- **Left sidebar (collapsible, resizable, with mini-rail mode):**
  - Top: workspace switcher (avatar + name + chevron → popover with workspaces, "Create workspace", "Invite people").
  - Primary actions: **New chat** (primary button with `⌘K`/`⌘N` hint), **Search** (opens command palette).
  - Nav sections: *Home, Chat, Studio, Library, Agents, Projects, Knowledge, Automations, Integrations*.
  - **Pinned** and **Recent** conversation lists with grouping (Today / Yesterday / Previous 7 days / Older), hover actions (pin, rename, archive, delete), active indicator, unread dot, truncation with fade.
  - Bottom: usage meter (credits/quota ring), Upgrade card (dismissible), user menu (avatar, plan badge), and the small "Meteor AI · by Abstraction" lockup.
  - Collapse to rail (icons + tooltips) with smooth animation; remember state; keyboard `⌘B`.
- **Top bar (contextual):** breadcrumb/title (inline-editable for chats/projects), model selector, share button, presence avatars (mock collaborators), overflow menu, theme toggle, notifications bell with popover.
- **Main canvas:** centered content with max-width tokens per screen type (chat 760–820px; library full-bleed grid; studio multi-pane).
- **Right inspector panel (collapsible):** context-aware (message details, sources, artifacts, settings of a generation, agent config, file preview). Resizable with min/max, remembers width.
- **Global overlays:** command palette, toasts, modals, drawers, tooltips, popovers, context menus, hotkey cheat-sheet (`?`).
- **Responsive:** desktop ≥1280 (full shell), laptop 1024–1279 (inspector overlays), tablet 768–1023 (sidebar becomes drawer, bottom tab bar optional), mobile <768 (single-column, bottom nav, full-screen composer, sheet-style modals). Everything usable at **360px width**.

### 5.2 Global behaviors

- **Routing:** real URLs for every screen/state (deep-linkable). Page transitions are subtle (fade/slide ≤180ms).
- **Keyboard first:** full keyboard navigation, visible focus rings, skip-to-content link, roving tabindex in lists/menus, `Esc` closes layers in correct stacking order, focus trap + return in modals.
- **Hotkeys:** `⌘K` palette, `⌘N` new chat, `⌘B` sidebar, `⌘/` shortcuts, `⌘⇧L` theme, `⌘Enter` send, `⌥↑/↓` navigate messages, `⌘.` toggle inspector, `/` focus composer, `G then H/C/S/L` go-to.
- **Persistence:** theme, sidebar state, panel widths, last model, drafts (per conversation), recent searches in `localStorage`.
- **Loading strategy:** skeletons that match final layout; optimistic UI; suspense boundaries; no layout shift.
- **Error strategy:** inline errors, retry affordances, global error boundary page, offline banner, 404/403/500 pages designed on-brand.
- **Accessibility:** WCAG 2.2 AA minimum; color-contrast verified in both themes; ARIA live regions for streaming text and toasts; reduced-motion; screen-reader labels on icon buttons; language attribute; semantic landmarks.
- **i18n-ready:** all strings via a tiny `t()` helper with `en` default and `pt-BR` stub dictionary; RTL-safe logical CSS properties.

---

## 6. SCREEN INVENTORY (BUILD ALL OF THESE)

> For **each** screen: design the default state + loading + empty + error + populated + (where relevant) selected/hover/focus/disabled/permission-denied/offline/long-content/overflow variants. Build realistic mock data (see §10).

### 6.1 Marketing / public

1. **Landing page (home)** — hero with display headline, subhead, primary + secondary CTA, animated product preview (a looping, scripted mock chat/studio demo built in real UI, not a video), logo-cloud placeholder (neutral, no real brands), feature sections (3–5 with large visuals), interactive "model/mode" tabs demo, testimonial carousel (fictional people, clearly fake), security/compliance strip, pricing teaser, FAQ accordion, final CTA, footer with "by Abstraction".
2. **Pricing page** — plan cards (Free / Pro / Team / Enterprise), monthly/annual toggle with savings pill, comparison table with sticky header, usage-based add-ons explainer, FAQ, "Contact sales" modal.
3. **Product tour / Features page** — alternating sections for Chat, Studio, Agents, Knowledge, Automations.
4. **About / Abstraction page** — company story, values, minimal team grid (fictional), careers teaser.
5. **Changelog page** — timeline with version tags, categories (New / Improved / Fixed), expandable entries.
6. **Docs-style help center landing** — search, categories, popular articles.
7. **Legal pages shell** — Terms / Privacy with TOC + scrollspy.
8. **404 / 500 / Maintenance pages.**

### 6.2 Auth & onboarding

9. **Sign in** — email + password, SSO buttons (Google / GitHub / Microsoft as neutral icons), magic link, error states, "forgot password".
10. **Sign up** — with password strength meter, terms checkbox, inline validation.
11. **Forgot / reset password** — 3 states.
12. **Email verification** — code input (6 boxes, paste support, auto-advance, error shake).
13. **Onboarding flow (multi-step, animated)** — Welcome → Role/use-case selection (card grid, multi-select) → Connect sources (optional) → Choose theme & density → Invite teammates → Meet Meteor (interactive first prompt). Progress indicator, skip, back, and persisted progress.
14. **Product coach marks / guided tour** — tooltips/spotlight overlay highlighting sidebar, composer, model picker, library.

### 6.3 Home

15. **Home dashboard** — greeting (time-aware), large composer front-and-center, suggested prompts (chips with categories), "Continue where you left off" cards, recent projects, quick actions (New chat / New image / New agent / Upload), tips carousel, usage snapshot, and a "What's new" card.

### 6.4 Chat (the heart of the product — be exhaustive)

16. **Chat conversation view**
    - Message list with **user** and **Meteor** messages; distinct but harmonious styling; avatars; timestamps on hover; grouped consecutive messages.
    - **Streaming** responses with token-by-token reveal, animated caret, "Thinking…" state with expandable reasoning summary, **stop** button, regenerate, continue.
    - Rich content renderer: headings, lists, tables (horizontally scrollable, sticky header), blockquotes, callouts, **code blocks** (syntax highlighted, language label, copy, wrap toggle, line numbers, "Run"/"Open in Studio" action), inline code, math (KaTeX-style placeholder), footnote citations `[1]` with hover cards, link previews, collapsible sections, checklists, mermaid-like diagram placeholder, image/figure with caption + lightbox, file attachments, audio/voice message bubble with waveform.
    - **Message actions:** copy, edit (user messages → inline editor with save & resubmit), regenerate with different model, branch conversation (version switcher `‹ 2/3 ›`), thumbs up/down with reason popover, share, pin, bookmark, read aloud, translate, "Explain simpler", report.
    - **Sources/citations panel** (right inspector) with favicon, title, snippet, relevance, open/ copy.
    - **Artifacts:** side-by-side document/code/preview that opens in the inspector (resizable), with tabs (Preview / Code / History), version dropdown, copy, download, fullscreen, "Ask Meteor to edit".
    - **Tool-use cards:** web search, file analysis, code execution, image generation, data viz — each with running/succeeded/failed states, collapsible logs, durations.
    - **Composer (hero component):** auto-growing textarea, attach (+) menu (upload file, image, from Library, from Knowledge, link, screenshot), drag-and-drop overlay, paste-image thumbnails, attachment chips with progress/remove, **model selector** (grouped list with capability badges, speed/quality sliders, context size), **mode toggles** (Search, Think, Canvas, Agent), `/` slash-command menu, `@` mention menu (files, agents, people), voice input button with live waveform + transcript, send button (morphs to stop), character/token counter, draft autosave, `⌘Enter` send, `Shift+Enter` newline, upload errors, disabled states, safe-area handling on mobile.
    - **Empty chat state** with greeting, composer, suggested prompts grid, and capability cards.
    - **Scroll behavior:** auto-stick to bottom while streaming, "Jump to latest" pill when scrolled up, scroll-to-message from search, sticky date separators.
    - **Conversation header:** editable title (auto-generated shimmer then settles), model badge, share, export (MD/PDF/JSON), move to project, archive, delete with confirm.
    - **Share modal:** visibility (private/link/workspace), copy link, expiry, permissions, collaborator list with roles.
    - **Conversation search** (in-chat find with highlights and next/prev).
    - **Long-conversation features:** outline/TOC sidebar, pinned messages, collapsed older messages.
17. **Compare mode** — same prompt to 2–3 models side by side with synchronized scroll, per-model latency/token stats, "pick winner".
18. **Voice mode (full-screen)** — animated orb/visualizer using the Meteor gradient, live captions, mute, interrupt, end call, device selector, error/permission states.

### 6.5 Studio (creative/generative workspace — inspired by the Muse reference)

19. **Studio home** — grid of recent creations, templates carousel, "Create new" cards by type (Image, Video, Audio, Document, Code, Presentation, 3D placeholder), filters/sort, masonry layout.
20. **Studio editor / canvas** — multi-pane:
    - Left: **prompt & parameters panel** (prompt box, negative prompt, style presets as visual swatches, aspect-ratio selector with live frame preview, seed, steps, guidance sliders with numeric inputs, model/version select, quality toggle, batch count, advanced accordion).
    - Center: **canvas** with zoom/pan, checkerboard transparency, grid/rulers toggle, generated variations grid (1–4), selection outlines, compare slider (before/after), inpaint/mask brush tool, crop, upscale, vary, remix, extend.
    - Right: **layers/history/inspector** — generation history timeline (thumbnails, params recall), layers list (drag reorder, visibility, lock, opacity, blend mode), properties.
    - Bottom/floating **toolbar** (select, move, brush, eraser, text, shapes, crop, color picker, undo/redo, zoom, fit, fullscreen) with tooltips + hotkeys.
    - **Generation progress UI:** staged progress (Queued → Generating → Refining → Done) with Meteor-trail animation, ETA, cancel, queue position, and failure/retry state with reason.
    - **Export modal:** format (PNG/JPG/WebP/SVG/PDF/MP4/GIF), size, quality, transparent bg, metadata toggle, copy to clipboard, send to Library.
21. **Video timeline view** — multi-track timeline (video/audio/captions), scrubber, waveform, clips draggable & trimmable, zoom, playhead, markers, preview player with transport controls (mocked playback).
22. **Audio studio view** — waveform editor with regions, voice selector, speed/pitch controls, transcript sync.
23. **Document/presentation builder** — outline-first generation (editable outline tree → generate), slide thumbnails rail, slide editor with text/image blocks, theme chooser, speaker notes, present mode (fullscreen).
24. **Node/flow canvas (Workflows)** — infinite canvas with draggable nodes (Input, Prompt, Model, Tool, Condition, Output), animated edges, minimap, zoom controls, node inspector, run log drawer, validation badges, run/step/stop.

### 6.6 Library & assets

25. **Library (all assets)** — grid/list/masonry toggle, filter chips (type/date/project/model/starred), sort, search, multi-select with bulk actions bar, hover preview, quick-look (spacebar), infinite scroll with skeletons, drag to project/folder, empty & error states.
26. **Asset detail page/modal** — large preview, metadata, prompt & parameters ("Remix"), version history, comments, download/share, related assets.
27. **Collections / folders** — tree + grid, create/rename/move, nested breadcrumb, color labels, sharing.
28. **Trash / archive** — restore, delete forever, retention notice.

### 6.7 Agents & automations

29. **Agents gallery** — Meteor-built agents + community-style templates (fictional), categories, search, install/try, ratings (fake), "Create your own".
30. **Agent builder** — name/avatar, instructions editor (rich text + variables), knowledge attach, tools toggles (search, code, files, browser, custom API), model & temperature, conversation starters, guardrails, test panel (live chat on the right), versioning + publish flow.
31. **Agent run view** — step-by-step execution trace (plan → tool calls → observations → answer), timeline, token/cost, replay, human-approval prompt UI.
32. **Automations** — list with status toggles, trigger → conditions → actions builder (visual steps), schedule picker (cron-friendly UI), run history table with filters, failure details, test run.
33. **Integrations** — grid of connectors (neutral icons, no real brand logos required), connect modal with scopes & permissions explanation, connected state with health, disconnect confirm, per-integration settings.

### 6.8 Knowledge & projects

34. **Knowledge base** — upload zone (multi-file, folder), processing states (queued/indexing/ready/failed), source list with type icons, chunk preview, search test panel ("ask your knowledge"), permissions.
35. **Projects list & project detail** — instructions, files, linked chats, members, activity feed, pinned outputs, project-level model defaults, tabs (Overview / Chats / Files / Members / Settings).
36. **Notes / Memory** — what Meteor remembers (list with edit/delete/forget, categories, toggle memory on/off, privacy explainer).

### 6.9 Collaboration & workspace

37. **Workspace overview** — members table (role, status, last active, actions), invite modal (email chips, role select, bulk paste), pending invites, groups, SSO/SCIM info card (enterprise).
38. **Activity / audit log** — filterable data table, export, detail drawer.
39. **Comments & mentions inbox** — notifications center, unread/read, filters, mark all read.
40. **Shared with me / public gallery view** — read-only shared conversation/asset page with "Remix" CTA and sign-up nudge.

### 6.10 Settings & account (a full, tabbed settings area)

41. **Profile** (avatar upload/crop, name, handle, bio, timezone, language).
42. **Appearance** (theme, density, font size, accent presets, reduce motion, sidebar behavior, preview card live-updating).
43. **Model & behavior** (default model, response style/tone presets, custom instructions, memory, streaming speed, citations on/off).
44. **Notifications** (matrix table: channels × events with toggles).
45. **Privacy & data** (data controls, export data, delete account flow with typed confirmation, training opt-out explainer, sessions/devices list with revoke).
46. **Security** (password, 2FA setup wizard with QR placeholder + recovery codes, passkeys, API tokens table with create/revoke/copy-once).
47. **Billing & plans** (current plan card, usage charts, invoices table, payment method card UI, change plan modal, cancel flow with retention step, credits purchase).
48. **Usage & analytics** (charts: tokens/day, generations by type, top models, cost; date-range picker; export CSV; tooltips; empty/loading) — follow the `dataviz` approach if available: accessible, colorblind-safe, consistent in light/dark.
49. **API & developers** (keys, webhooks, usage, code snippets with tabs for cURL/JS/Python, playground mini-console).
50. **Shortcuts & accessibility** (hotkey customization table, screen-reader tips, motion toggles).
51. **About Meteor** (version, release notes link, licenses, "Meteor AI by Abstraction" credits).

### 6.11 System-level UI

52. **Command palette (`⌘K`)** — fuzzy search across chats, files, projects, agents, settings, actions; sections, recent, keyboard nav, preview pane, nested commands, empty state.
53. **Notifications popover + full page.**
54. **Global search results page** — tabs by type, filters, highlighted matches.
55. **Hotkeys cheat-sheet modal.**
56. **Feedback modal** (rating, category, text, attach screenshot).
57. **Upgrade / paywall modals** (feature-gated states, usage-limit reached state with countdown).
58. **Status banners** (incident, maintenance, offline, rate-limit) and **toast system** (success/info/warn/error/with action/undo/progress).
59. **Confirm/destructive dialogs** pattern (typed confirmation variant).
60. **Cookie/consent banner** (compact, non-intrusive).

---

## 7. COMPONENT LIBRARY TO DELIVER

Beyond the screens, deliver a living **Component Gallery** route (`/_design` or `/gallery`, dev-only) that showcases **every** component and variant in light + dark, with a theme toggle, density toggle, and RTL toggle. Include at minimum:

**Foundations:** colors, typography, spacing, radius, elevation, motion, iconography, gradients, grid/layout, z-index scale.

**Inputs:** Button (primary/secondary/tertiary/ghost/destructive/glow, sizes, icon-only, loading, split button), Toggle/Switch, Checkbox, Radio, Slider (single/range with ticks), Stepper, Segmented control, Text field (label, helper, error, prefix/suffix, clear), Textarea (auto-grow), Search field, Select/Combobox (async, multi, creatable, grouped, virtualized), Date & range picker, Time picker, Color picker, File dropzone, OTP input, Tag/Chip input, Rating, Rich-text mini editor, Prompt editor (variables highlighting).

**Display:** Avatar (+ group, presence), Badge, Tag/Chip, Tooltip, Popover, Hover card, Card (variants), List/Item, Table (sortable, selectable, sticky, resizable cols, virtualized), Tree, Accordion, Tabs (line/pill/segmented), Breadcrumbs, Pagination, Stat/KPI tile, Progress (linear/circular/segmented/indeterminate), Skeletons, Empty state, Callout/Alert, Code block, Kbd, Divider, Timeline, Stepper/Wizard, Carousel, Image with blur-up, Lightbox, Chart wrappers.

**Overlays:** Modal, Drawer/Sheet (side/bottom), Dropdown menu (nested, with icons, checkable, shortcuts), Context menu, Toast, Command palette, Spotlight/coach mark, Banner.

**Feedback:** Spinner, Streaming caret, Typing indicator, Waveform, Meteor loader (brand loader: a streak that arcs across), Success/Error animations.

**Meteor composites:** Composer, MessageBubble, ToolCallCard, CitationChip, ArtifactPane, ModelPicker, UsageMeter, PlanCard, PromptSuggestionChip, GenerationProgress, CanvasToolbar, TimelineTrack, NodeCard, AgentCard, AssetCard, ConversationListItem, WorkspaceSwitcher, ShortcutKey, ThemeToggle.

Each component must document: props, variants, states, accessibility notes, and usage example in the gallery.

---

## 8. INTERACTION & MOTION SPEC (BE SPECIFIC)

- **Streaming text:** reveal by token chunks (20–60ms cadence with natural jitter), caret pulses at 1s, auto-scroll sticky, code blocks stream with line-by-line reveal, tables reveal row by row, "Thinking…" shimmers with Meteor-trail gradient sweeping L→R at 1.6s.
- **Sidebar collapse:** width animates 280→64 over 240ms (emphasized easing); labels fade out first (90ms), icons slide to center.
- **Modals:** scale 0.96→1 + fade over 180ms, backdrop fade 140ms, focus trap, return focus.
- **Popovers/menus:** origin-aware scale+fade, 120ms; items stagger ≤ 20ms.
- **Toasts:** slide-in from bottom-right (top on mobile), swipe-to-dismiss, hover pauses timer, stack with depth.
- **Drag & drop:** ghost preview, drop-target highlight with animated dashed border, spring settle.
- **Buttons:** hover brightness/glow, press 0.98 scale, loading replaces label with spinner without width jump.
- **Cards:** hover elevates 2px with soft shadow + border brighten; focus-visible ring offset 2px.
- **Skeletons:** shimmer 1.4s, must match final layout dimensions exactly.
- **Page transitions:** shared-element feel for conversation → artifact, library card → detail (use layout animations where feasible).
- **Generation progress:** a glowing streak travels along a thin track; completion triggers a brief radial bloom and the result image eases in (blur 12px→0, scale 1.02→1).
- **Reduced motion:** disable parallax/bloom/shimmer-sweeps; keep opacity transitions ≤100ms.
- All animations ≤ 600ms except ambient/ loading loops; nothing blocks interaction.

---

## 9. CONTENT & MOCK DATA (REALISTIC, ON-BRAND)

- Create typed mock layers: `users, workspaces, conversations, messages (rich blocks), artifacts, assets (images/video/audio thumbnails generated as gradients/SVG patterns — **no external image dependencies**), projects, agents, automations, integrations, notifications, invoices, usage series, audit events`.
- Populate with **at least**: 40 conversations (varied lengths, some very long), 120 assets, 12 projects, 20 agents, 15 automations, 24 integrations, 60 audit events, 12 months of usage data, 5 workspace members with different roles.
- **Images/thumbnails:** generate deterministic procedural art (SVG/Canvas gradients, noise, shapes) per asset seed so the Library and Studio look rich without external files. Make them tasteful and on-brand (cosmic-soft, not kitsch).
- **Simulated latency & failures:** a mock API layer with configurable delay, random failure toggle (dev panel), and streaming generator.
- **Copy:** brand-consistent, human, concise. Include realistic prompt examples (writing, coding, research, design, data analysis, planning). Include a few **long** messages and **edge cases** (very long words/URLs, RTL snippets, emoji, code with long lines, tables with 12 columns).
- Include a hidden **Dev tools panel** (`⌘⇧D`): toggle latency, force error, switch plan tier (Free/Pro/Team/Enterprise), toggle empty states, toggle offline, reset data, switch locale.

---

## 10. ACCESSIBILITY, PERFORMANCE & QUALITY CHECKLIST

**Accessibility**
- Contrast: body text ≥ 4.5:1, large text/UI ≥ 3:1 in both themes (verify, don't assume).
- Every interactive element reachable & operable by keyboard; visible `:focus-visible`.
- Landmarks (`header/nav/main/aside/footer`), heading hierarchy, labels, `aria-live` for streaming/toasts, `aria-expanded/controls`, dialog roles, listbox/combobox patterns done right.
- Target sizes ≥ 24px (44px on touch). No information by color alone.
- Test with reduced motion, 200% zoom, high-contrast/forced-colors fallback.

**Performance**
- Code-split by route; lazy-load heavy views (Studio, timeline, canvas, charts).
- Virtualize long lists (messages, library, tables).
- Avoid layout shift (CLS ≈ 0), optimize fonts (`font-display: swap`, subset), images lazy with blur-up.
- Keep main bundle lean; report bundle sizes in the final report.

**Code quality**
- TypeScript strict, no `any` (justify exceptions), no unused code, consistent naming, small focused components, hooks extracted, StyleX styles colocated per Astryx conventions.
- Unit tests for critical logic (stream reducer, composer behavior, theme persistence) and a smoke test per route (renders without errors).
- Zero console errors/warnings in normal flows.
- `typecheck`, `lint`, and `build` pass cleanly.

---

## 11. BUILD ORDER (FOLLOW THIS SEQUENCE)

1. **Step Zero** — Astryx install + `init` + read docs + `docs/ASTRYX_CONVENTIONS.md` (§1).
2. **Reference Analysis** — study all Muse reference images; write `docs/DESIGN_DECISIONS.md` (§4).
3. **Theme** — Meteor token layer (color, type, radius, shadow, motion), light/dark/midnight, theme provider, no-flash bootstrap.
4. **Foundations & Component Gallery** — primitives + Meteor composites, verified in gallery in both themes.
5. **App shell** — sidebar, top bar, inspector, routing, command palette, toasts, overlays, responsive behavior.
6. **Mock layer** — typed data, fake streaming, dev panel.
7. **Chat** — complete (composer, streaming, artifacts, tool cards, citations, branching, share).
8. **Home + Library + Projects + Knowledge.**
9. **Studio** — editor, progress, history, export; then video/audio/doc builders; then Workflows canvas.
10. **Agents + Automations + Integrations.**
11. **Workspace, Settings (all tabs), Billing, Usage, Developers.**
12. **Marketing site + Auth + Onboarding + system pages.**
13. **Polish pass** — motion, empty/error states, a11y audit, responsive audit at 360 / 768 / 1024 / 1440 / 1920, dark-mode audit, performance pass.
14. **Fidelity pass** — side-by-side with every reference image; fix drift.
15. **Screenshots + final report** (§12–§13).

Commit in logical steps with clear messages. Do **not** open a pull request unless I ask.

---

## 12. SCREENSHOT DELIVERABLES (I WILL REVIEW VISUALLY — THIS IS CRITICAL)

Run the app and use a headless browser (Playwright) to capture **high-quality screenshots** (`deviceScaleFactor: 2`) into `docs/screenshots/`, organized and named `NN-area-screen-state-theme-viewport.png` (e.g., `07-chat-streaming-dark-1440.png`). Wait for fonts, animations and images to settle before capturing; hide dev overlays; use deterministic mock data.

**Capture at minimum:**

- **Viewports:** 1440×900 (primary), 1920×1080 (key screens), 1024×768 (tablet-landscape), 768×1024 (tablet), 390×844 (mobile).
- **Themes:** Light **and** Dark for every primary screen (Midnight for Studio).
- **Screens/states (minimum list):**
  - Landing (full page + hero fold), Pricing, Features, Changelog, About
  - Sign in, Sign up, OTP, each onboarding step
  - Home (empty + populated), Command palette open, Notifications popover
  - Chat: empty, streaming mid-response, long conversation with code/table/citations, artifact open in inspector, tool-use cards (running/succeeded/failed), branch switcher, share modal, composer with attachments + model picker open + slash menu + mention menu, voice mode
  - Compare mode
  - Studio: home, editor (prompt panel + canvas + history), generating progress, result variations, export modal, video timeline, audio studio, doc builder, workflow canvas with run log
  - Library: grid, list, masonry, multi-select bulk bar, asset detail, empty, loading skeleton
  - Agents gallery, Agent builder (+ test panel), Agent run trace
  - Automations list + builder, Integrations (connected + connect modal)
  - Knowledge (processing states), Projects list + detail
  - Workspace members, Audit log, Inbox
  - **All Settings tabs** (Profile, Appearance, Model, Notifications, Privacy, Security, Billing, Usage, Developers, Shortcuts, About)
  - Upgrade/paywall modal, destructive confirm dialog, toasts stack, error/404/offline states
  - **Component Gallery** (multiple sections, light + dark)
- Also produce a **contact-sheet / overview image** per area (grid of thumbnails) so I can scan quickly, plus a `docs/screenshots/INDEX.md` that lists every image with a one-line description.
- **Reference comparison board:** for each major screen, create a side-by-side image **[Muse reference | Meteor result]** (reference on the left, your build on the right) named `compare-NN-screen.png`, so I can judge fidelity at a glance.

> When you finish, **send me the screenshots** (the contact sheets and comparison boards first, then the full set). Don't just say they exist — surface them.

---

## 13. FINAL REPORT (MARKDOWN, HONEST, SCANNABLE)

At the end, produce `docs/FINAL_REPORT.md` and summarize it in chat:

1. **What was built** — screen-by-screen checklist from §6 marked ✅ Done / 🟡 Partial / ❌ Not done, with one-line notes.
2. **Astryx usage** — which Astryx components/tokens were used, and a list of **custom Meteor composites** built because Astryx lacked an equivalent (with reasons).
3. **Reference fidelity** — where it matches closely, where it deviates, and why (Known deviations).
4. **Quality results** — typecheck/lint/build/test status, a11y audit summary (contrast, keyboard, screen reader), performance numbers (bundle sizes, CLS), responsive audit.
5. **How to run** — exact commands, env notes, routes list, dev-panel hotkeys.
6. **Screenshots index** — path + description.
7. **Known issues & next steps** — honest list, prioritized.

---

## 14. DEFINITION OF DONE (ALL MUST BE TRUE)

- [ ] Astryx installed per §1, `init` run, docs read, conventions file written.
- [ ] Every component/screen uses Astryx + StyleX + tokens; no stray UI libraries; no hard-coded colors.
- [ ] All screens in §6 exist, reachable, deep-linkable, with realistic content and complete states.
- [ ] Light, Dark (and Midnight for Studio) are fully designed and verified.
- [ ] Looks like it belongs to the same family as the Muse AI references, **branded as Meteor AI by Abstraction**.
- [ ] Responsive from 360px to 1920px+; keyboard-accessible; AA contrast; reduced-motion respected.
- [ ] Component Gallery complete.
- [ ] `typecheck`, `lint`, `build` pass; zero console errors in primary flows.
- [ ] Screenshots, contact sheets, comparison boards and INDEX delivered to me.
- [ ] `docs/DESIGN_DECISIONS.md` and `docs/FINAL_REPORT.md` written honestly.

---

## 15. TONE OF YOUR WORK

Aim for the feeling of a product that a thoughtful, obsessive design team spent a year on: **calm, fast, precise, a little magical**. Prioritize craft in the details — spacing, alignment, state coverage, motion timing, copy. If you must choose between *more screens* and *better screens*, deliver **all the screens, each at high quality**; cut ornament, never completeness or polish.

**Start now with Step Zero (§1). After that, do the Reference Analysis (§4) on the images I attached, and proceed through §11 without waiting for me. Send the screenshots when done.**

---

*Meteor AI — an Abstraction product.*
