<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: St. Joseph's Academy of Malinao
description: Vibrant, welcoming brand system for a Catholic school — green-rooted, gold-crowned, built around the Guardians.
---

# Design System: St. Joseph's Academy of Malinao

## 1. Overview

**Creative North Star: "The Guardian's Grove"**

Green is growth, life, and rootedness; gold is achievement and the light of a faith-centered community. The Grove is a place that is alive and cultivated — energetic but never chaotic, proud but never cold. This system carries the spirit of an active school where students are **Guardians**: it should feel like belonging, movement, and care, with the quiet dignity of a Catholic institution underneath the energy.

The vibrancy is **committed**: a single confident green does real work across surfaces (30–60%), and gold appears as a crown, not confetti. Energy comes from color, motion, dimensionality, and real photography of Guardians — never from busy backgrounds, rainbow text, or decorative noise. Typography pairs a modern geometric sans (forward-looking, clear) with restrained serif accents (heritage, dignity), so the school reads as both ambitious and rooted.

**Rooted, but forward-thinking.** The school honors its Catholic traditions while presenting itself as genuinely modern — and the interface carries that duality through **depth and considered motion**. This system embraces **3D styling** (real perspective, layered parallax, tactile depth, subtle dimensional hero and signature moments) and **choreographed animation** (orchestrated entrances, scroll-driven reveals, smooth state transitions) as a deliberate signal of innovation. Motion is warm and purposeful, never gratuitous: it reveals, guides, and delights, but the content is always legible and usable without it. The 3D and animation are the *craft* that says "forward-thinking"; the dignity, warmth, and clarity underneath keep it a Catholic school, not a tech demo.

This system explicitly rejects the three things a school site most often becomes: **generic corporate/SaaS gloss** (gradient-blob heroes, identical feature-card grids), a **dated clip-art school website** (clutter, outlined/rainbow text, tiled backgrounds), and a **cold institutional portal** (gray, bureaucratic, form-heavy). Warmth and humanity are non-negotiable, even on official pages.

**Key Characteristics:**
- Green-forward and committed — color carries the brand, not a timid accent.
- Gold as a deliberate crown for achievement, faith, and emphasis.
- Modern geometric sans grounded by occasional serif dignity.
- Forward-thinking craft: purposeful **3D depth** and **choreographed motion** as signals of innovation.
- Energy from photography, dimensionality, and motion — never from visual noise.
- Human and warm at every touchpoint; contact always one step away.
- Modern in craft, timeless in values — and always accessible (reduced-motion honored, content usable without effects).

## 2. Colors

A committed green-and-gold palette on clean white ground: green does the heavy lifting, gold crowns the moments that matter, white keeps it breathable and legible.

### Primary
- **Guardian Green** (green family; exact value `[to be resolved during implementation]`): The school's spirit color and the backbone of the system — headers, primary buttons, key surfaces, and brand moments. Rich and saturated enough to feel energetic; disciplined enough to hold large areas without shouting.

### Secondary
- **Academy Gold** (warm gold/yellow family; `[to be resolved during implementation]`): The crown — used for emphasis, achievement, accents on green, and celebratory highlights. Deployed sparingly so it always reads as special. Must clear contrast requirements wherever it carries text.

### Neutral
- **Chapel White / Off-White** (`[to be resolved during implementation]`): The primary ground — keeps the site breathable, legible, and warm rather than clinical. A soft off-white, not stark clinical white.
- **Ink** (near-black with a whisper of green; `[to be resolved during implementation]`): Body text and high-contrast type on light grounds. Bias the darkest text toward ink, never light-gray "elegance."
- **Muted supporting grays** (`[to be resolved during implementation]`): Borders, dividers, secondary text — tinted very slightly toward the green hue, never a default cool gray.

### Named Rules
**The Committed Green Rule.** Green carries 30–60% of the *brand weight* per view through structural elements — large green panels, full-width bands, display-type ink, the footer — on a clean white canvas (near-black in dark mode). The canvas itself is never green, and green is never a timid accent: if a view reads as a white page with only a green button, the strategy has failed. (Reference implementation: the homepage hero — green display headline + Grove statue panel + proof band ≈ 34% of the fold.)

**The Gold-as-Crown Rule.** Gold is emphasis, never filler. Reserve it for achievement, faith, and the single most important highlight in a view. Never tile it, gradient it, or use it for large text blocks unless contrast is verified.

## 3. Typography

**Display Font:** A modern **geometric sans** `[font to be chosen at implementation]` — clean, confident, forward-looking.
**Body Font:** The same geometric sans (or a highly legible humanist sans) for maximum readability across ages and screens.
**Accent Font:** A **serif** `[font to be chosen at implementation]` used sparingly for dignity — a crest motto, a pull quote, a signature heading. Heritage, not the workhorse.

**Character:** Ambitious and clear, grounded by occasional serif gravity. The pairing sits on a real contrast axis (geometric sans + serif), never two similar sans families. The serif is a spice, not the meal.

### Hierarchy
- **Display** (bold, `clamp(...)` up to ~4–5rem, tight-but-not-cramped line-height): Hero headlines and page titles. Letter-spacing no tighter than -0.04em. Use `text-wrap: balance`.
- **Headline** (semibold, large): Section headings; the geometric sans carries these.
- **Title** (medium/semibold): Sub-section and card headings.
- **Body** (regular, comfortable size, 1.5–1.6 line-height): Prose; cap measure at 65–75ch. Ink on white, contrast ≥4.5:1.
- **Label** (medium, small): Buttons, tags, nav. Avoid the tiny-uppercase-tracked eyebrow on every section.

### Named Rules
**The Serif-as-Spice Rule.** Serif appears at most once or twice per page, for genuine gravity (motto, quote, hero flourish). Everything structural is the geometric sans.

## 4. Elevation

This system works on **two depth registers**. Everyday UI is **flat and tonally-layered**: cards, sections, and forms are distinguished by green/white/off-white tone at rest, with soft shadow appearing only as a *response* to interaction (hover lift, focus, raised buttons) — depth earned by state, not sprinkled everywhere. **Signature moments** — the hero, key section transitions, featured Guardians, milestone/achievement showcases — earn **true 3D depth**: real perspective transforms, layered parallax, tactile dimensional elements, and choreographed entrances. The two registers keep the site both calm to read and impressive to experience.

Prefer performant, GPU-friendly depth (CSS 3D transforms, `perspective`, `translateZ`, layered parallax; a lightweight WebGL/3D layer only where it genuinely elevates a signature moment). Depth and motion are progressive enhancements — the page is complete and legible before any of it runs.

### Named Rules
**The Flat-Until-Touched Rule.** Everyday cards and surfaces sit flat at rest, separated by tone. A soft shadow appears only on hover/focus or for genuinely floating elements (menus, dialogs). No permanent drop-shadows on every card.

**The Earned-Dimension Rule.** True 3D and choreographed motion are reserved for signature moments (hero, feature reveals, achievements), not applied uniformly to every element. Dimensionality that appears everywhere reads as noise; used deliberately, it reads as craft.

**The Enhancement-Not-Gate Rule.** 3D and animation enhance an already-visible, already-usable page. Never gate content visibility on a reveal transition (it fails on reduced-motion, hidden tabs, and headless renderers). Every effect has a `prefers-reduced-motion` fallback — a calm crossfade or static state.

## 5. Components

No component library exists yet beyond a default shadcn button — components will be documented on the next scan-mode run once the homepage and shared UI are built. When they are, expect: a **Guardian Green primary button** with a gold-tinged hover, warm off-white cards separated by tone, inputs with a green focus ring, and a navigation that keeps the "Contact" path always visible.

The system also anticipates a **signature dimensional hero** — a 3D / parallax showcase (real perspective, layered depth, choreographed entrance) that carries the forward-thinking statement, with a static, fully-legible fallback for reduced-motion and non-3D contexts.

## 6. Do's and Don'ts

### Do:
- **Do** let **Guardian Green** carry 30–60% of surfaces — commit to it.
- **Do** reserve **gold** for achievement, faith, and single most-important highlights.
- **Do** lead with **real photography of Guardians** — actual faces and school life are the primary source of energy and trust.
- **Do** keep **contact one tap or scroll away** from any page.
- **Do** verify contrast: body text ≥4.5:1, and check gold-on-green and white-on-gold carefully.
- **Do** honor `prefers-reduced-motion` with a calm crossfade/instant alternative for **every** animation and 3D effect.
- **Do** use the **serif sparingly** for dignity; the geometric sans is the workhorse.
- **Do** use **3D depth and choreographed motion deliberately** on signature moments (hero, feature reveals, achievements) as the school's forward-thinking signal.
- **Do** keep 3D/animation **performant** (GPU-friendly transforms; lazy-load any WebGL) and **progressive** — content is complete and legible before effects run.

### Don't:
- **Don't** drift into **generic corporate/SaaS** — no gradient-blob heroes, sterile stock imagery, or endless identical feature-card grids.
- **Don't** ship a **dated / clip-art school website** — no clutter, rainbow or outlined text, tiled/busy backgrounds, marquees, or comic-sans energy.
- **Don't** go **cold & institutional** — no gray government-portal feel or bureaucratic form dumps; even official info stays human.
- **Don't** demote green to a timid accent on a mostly-gray page (violates The Committed Green Rule).
- **Don't** tile or gradient the gold, or use it for large text blocks without verified contrast.
- **Don't** put a tiny tracked-uppercase eyebrow above every section, and don't use `border-left` colored stripes as accents.
- **Don't** use gradient text (`background-clip: text`) or decorative glassmorphism.
- **Don't** apply 3D or heavy motion uniformly to every element (violates The Earned-Dimension Rule) — it turns craft into noise.
- **Don't** gate content behind a reveal animation, or let 3D/effects hurt performance, legibility, or accessibility. Impressive must never cost usable.
