<!-- SEED: re-run /impeccable document once the redesigned section markup lands, to capture the actual "Guardian's Grove v2" tokens and components in place of this hand-authored draft. -->
---
name: St. Joseph's Academy of Malinao
description: Warm editorial Catholic modernism for a Catholic school, a coconut-white canvas grounded by full evergreen structural sections, a confident serif display voice, and gold used only as fine, precious linework, built around the Guardians.
---

# Design System: St. Joseph's Academy of Malinao

## 1. Overview

**Creative North Star: "The Guardian's Grove" (v2)**

The Grove is re-founded as **warm editorial Catholic modernism**: a bright coconut-white canvas, grounded by deep evergreen structural sections, with a confident serif display voice and gold used only as fine, precious linework. It should read like an editorial magazine, not a SaaS product, not a clip-art school site, and not a cold institutional portal: rooted, dignified, and genuinely modern. Students are **Guardians**. The motto is **"Be like St. Joseph."** The values are **Selfless, Just, Achiever.**

Local identity threads through every page: St. Joseph's Academy of Malinao, Inc. sits in Malinao, Aklan, Philippines, a Diocesan school under the **Diocese of Kalibo**, a member of **CEAP Region VI**, **PEAC**-certified, an **ESC** voucher participating school, offering **Junior and Senior High School** on DepEd's newest JHS and Strengthened SHS (3-term) curriculum. These are not trivia; they are proof points of a real, accredited, locally-rooted institution and belong in footers, about copy, and admissions context.

Green still does the heavy lifting and gold still crowns the moments that matter, but the mechanism has changed from the first Grove: green no longer merely accents a white page, it **commits by massing into full structural sections** (an evergreen admissions band, an evergreen footer) that alternate against a warm, breathing coconut canvas. Gold has narrowed even further, from "crown" to **"detail"**: fine linework, labels, numerals, dots, rings, never a fill. Typography now carries a genuine editorial voice: **Instrument Serif** on every headline and **Hanken Grotesk** as the workhorse for body, UI, and labels. Depth and interest come from **restrained 2D motion and soft organic shapes** (blob masks, gold rings, radial glows, pills), not from true 3D or WebGL.

**Key characteristics:**
- Green-forward and committed, now expressed through full evergreen structural sections alternating with coconut and leaf-tint grounds, not a timid accent on white.
- Gold narrowed to fine detail: labels, numerals, dots, rings, and exactly one gold CTA on an evergreen ground.
- Instrument Serif carries every headline; Hanken Grotesk carries everything else.
- The eyebrow kicker (tracked uppercase label above a heading) is an embraced signature device, not a thing to avoid.
- Depth and interest come from organic blob masks, thin gold rings, soft radial glows, pill shapes, and big rounded section tops: all 2D, GPU-cheap, calm.
- Energy from photography, warm color massing, and considered motion, never from visual noise.
- Human and warm at every touchpoint; contact always one step away.
- Modern in craft, timeless in values, and always accessible (reduced-motion honored, content usable without effects).

This system explicitly rejects the same three failure modes as before: **generic corporate/SaaS gloss** (gradient-blob heroes, identical feature-card grids), a **dated clip-art school website** (clutter, outlined/rainbow text, tiled backgrounds), and a **cold institutional portal** (gray, bureaucratic, form-heavy). Warmth and humanity are non-negotiable, even on official pages.

## 2. Colors

Colors are **canonical by hex**. The values below are the single source of truth for the palette; the oklch equivalents consumed by shadcn tokens are defined in `app/globals.css` and must be derived from these hex values, never invented independently in this document. If a token in `app/globals.css` and this table ever disagree, this table wins and the CSS should be corrected to match.

### Named palette

| Token name | Hex | Role |
|---|---|---|
| Evergreen | `#0E3D2B` | Deepest green. Full structural sections (the admissions band, the footer), the nav logo mark, and serif display headlines on light ground. The "committed green" mass. |
| Palm | `#1E7A55` | Mid green. Interactive: links, the primary pill CTA, italic serif emphasis words, small accents and dots, all on light grounds only. This is `--primary`. |
| Piña Gold | `#C9A24B` | Gold. Fine detail only: eyebrow labels, serif step numbers (01/02/03), bullet dots, thin ring/underline linework, and exactly one gold pill CTA when it sits on an evergreen ground. Never fills large areas, never gradients, never large text unless contrast-verified. |
| Leaf Tint | `#EDF3ED` | Pale green wash. Alternate section ground (for example, Contact) to break up coconut without going full evergreen. `#F1F6F1` is an even lighter hover wash on rows. |
| Coconut | `#FBFAF6` | The default canvas and page background. Warm off-white, never stark white. |
| Ink | `#16221B` | Primary body and text ink, a green-tinted near-black. |

Supporting text grays (all green-tinted): `#34443B`, `#46564C`, `#5E6E64` (darkest to lightest secondary text), and `#E9F1EA` (light text on evergreen). Hairline borders on light ground use `rgba(14,61,43,0.10)` to `rgba(14,61,43,0.12)`. Spec-sheet neutrals (documentation and internal tooling only, not brand voice): `#F2F1EB`, `#8A8471` (mono caption gray).

**Palette usage law:** green does the heavy lifting (sections, CTAs, type accents); gold appears only as detail, labels, numbers, dots, rings, one CTA on dark green. Text ink is `#16221B`, a green-tinted near-black.

### Ground-keyed contrast law: read this before styling anything

This palette runs with almost no contrast headroom. Several pairings that look safe on the swatch grid actually fail WCAG 2.1 AA. The table below is the computed sRGB contrast ratio for every pairing this system relies on. Treat it as verbatim law, not a suggestion:

| Pairing | Ratio | Verdict |
|---|---|---|
| Piña Gold `#C9A24B` text on Evergreen `#0E3D2B` | 5.09 | PASS (gold text is legal only here) |
| Evergreen text on Gold pill `#C9A24B` | 5.09 | PASS (the one gold CTA) |
| Palm `#1E7A55` text on Coconut `#FBFAF6` | 5.06 | PASS |
| Palm text on Leaf Tint `#EDF3ED` | 4.70 | PASS, barely |
| White/Coconut text on Palm `#1E7A55` | 4.59 | PASS, barely (the primary CTA) |
| Piña Gold on Coconut/Leaf as text (eyebrows, numbers, dots) | 2.30 | FAIL |
| Palm on Evergreen (italic emphasis word, dots) | 2.31 | FAIL |
| Light text at alpha 0.5 on Evergreen (footer copyright, back-to-top style links) | 3.86 | FAIL |

**This is the single most important rule in this document.** The system runs at only about 4.5 to 5.2 on its passing pairs; there is no headroom left to spend. Every new pairing must be verified against this table's method before it ships, not assumed safe by analogy. From it follow three hard, ground-keyed rules:

- **Gold as text or numerals appears only on an evergreen ground.** On Coconut or Leaf Tint, gold is decorative linework only: thin rings, underlines, a single-color icon glyph, never text, never a numeral, never a meaning-bearing dot.
- **Palm emphasis (the italic serif word, accent dots) appears only on a light ground.** On an evergreen ground, emphasis is Piña Gold or light `#E9F1EA`, never Palm.
- **Minimum light-text alpha on evergreen is about 0.65.** Alpha 0.5 fails (3.86:1); body-weight light text on evergreen should sit at 0.72 or higher.

And the surviving principle from the first Grove is now load-bearing, not decorative: **never rely on color alone to convey meaning.** A Palm emphasis word that both fails contrast and carries meaning (for example, marking the one required field) is a double failure. Pair color with weight, an icon, or an underline wherever color is doing communicative work.

### Named Rules

**The Committed Green Rule (rewritten).** Green carries 30 to 60 percent of the page by massing into **full evergreen structural sections** (bands, the footer) plus Palm interactive accents and evergreen serif display words, on an alternating Coconut and Leaf Tint canvas. Full-bleed evergreen sections are now encouraged, not banned: the admissions band and the footer are entirely evergreen by design. Two failure modes remain, equally wrong: green as a timid accent on an otherwise gray or white page, and every section going evergreen so the canvas never gets to breathe coconut. The target is reached across the page as a whole, not on every single fold.

**The Gold-as-Detail Rule (was Gold-as-Crown).** Gold is precious fine linework: labels, numbers, dots, rings, underlines, and exactly one CTA on green. It is never a fill, a gradient, a tile, or a large text block unless contrast is individually verified against the matrix above. If gold ever seems to need to cover an area larger than a line, a ring, or a short label, that is a sign the design has drifted from this rule.

## 3. Typography

**Display, all headings: `Instrument Serif`**, weight 400 only, both roman and italic. Scale via size, never weight; it has no bold to fall back on. Used for every headline, section heading, card title (above the size floor below), big pull-quotes, and the serif step numbers (01/02/03). An italic word set in Palm marks emotional emphasis inside a headline (for example, "growing toward *tomorrow*") **on light grounds only**; on evergreen grounds emphasis switches to gold or light `#E9F1EA` per the contrast law in Section 2. Letter-spacing sits near zero to slightly negative at large sizes; headlines use `text-wrap: balance`.

**Body, UI, and labels: `Hanken Grotesk`**, weights 300 to 700. Body text runs 15 to 18px at a line-height of about 1.6 to 1.7: a rounded humanist sans chosen for warmth. It carries all prose, navigation, buttons, tags, and the eyebrow labels. Cap body measure at 65 to 75 characters per line for readability.

**Mono:** an existing mono (Geist Mono or `ui-monospace`) is kept only for spec-sheet and internal documentation captions. It is not a brand voice and never appears in site copy.

### The Instrument Serif size floor

Instrument Serif is a light, single-weight, high-contrast display face. Its hairlines erode at small sizes, which lowers effective contrast, and that is worse than usual given Section 2's zero headroom. It also hurts legibility for the older, low-DPI, and variable-connection audience this site serves.

- **Instrument Serif is for display only, at roughly 24px (`text-2xl`) and above.**
- **Headings and card titles below that floor use Hanken Grotesk semibold**, not the serif.
- "Scale via size, not weight" applies only within the serif's display range; it cannot rescue a small card title, since there is no bold 400-only fallback. Small titles are sans by rule, not by exception.

### The eyebrow-kicker device

Uppercase, about 12.5px, letter-spacing about 0.22em, weight 600, set in Piña Gold on evergreen or Palm on light ground, used as a section kicker above a heading. This is an embraced signature device: it appears above most section headings, not something to be rationed. If an eyebrow needs a separator (for example, between a category and a location), use spacing, a thin rule element, or a small styled dot span, never the interpunct character (`·`); the house copy rule banning mid dots stays in force for every use of this device.

### Hierarchy

- **Display** (Instrument Serif, up to about 4 to 5rem via `clamp()`): hero headlines and page titles. `text-wrap: balance`.
- **Headline** (Instrument Serif, at or above the 24px floor): section headings.
- **Title** (Instrument Serif at or above the floor, or Hanken Grotesk semibold below it): sub-section and card headings, per the size floor rule above.
- **Body** (Hanken Grotesk regular, 15 to 18px, line-height 1.6 to 1.7): prose; cap measure at 65 to 75ch; Ink on Coconut or Leaf Tint, contrast at or above 4.5:1.
- **Label** (Hanken Grotesk medium, small): buttons, tags, nav, and the eyebrow-kicker.

### Named Rules

**The Serif-as-Display Rule (replaces the old Serif-as-Spice Rule).** Instrument Serif now carries **all** headlines, not an occasional flourish; Hanken Grotesk is the body and UI workhorse. An italic Palm word inside a serif headline marks emphasis, on light grounds only. Below the roughly-24px size floor, headings switch to Hanken Grotesk semibold rather than shrinking the serif.

**The Eyebrow-Kicker Rule (new).** The tracked-uppercase gold or Palm eyebrow above a section heading is an embraced signature device, used deliberately across most sections. It never uses the interpunct (`·`) as an internal separator; use spacing, a thin rule, or a styled dot element instead.

## 4. Surface, Elevation and Shape

The canvas alternates across three registers rather than staying uniformly white: **Coconut** (the default ground), **Leaf Tint** (a soft, pale green break), and **full Evergreen sections** (structural bands such as the admissions band and the footer, which are entirely evergreen). This reverses the earlier rule that the canvas was never a green ground: committed green massing now includes the canvas itself for whole sections, not just contained panels floating on white.

- **Big rounded section tops** are a signature move: an evergreen band that follows a lighter section typically uses a large top radius (for example, `border-radius: 56px 56px 0 0`) so it reads as a lifted panel settling onto the page, not a hard color-block seam.
- **Soft organic shapes** are the decorative language:
  - Blob image masks: organic, asymmetric `border-radius` values (for example, `58% 42% 55% 45% / 52% 46% 54% 48%`) rather than rectangles or perfect circles.
  - Thin gold rings (about 1.5px border circles) and small dots (gold and Palm) as accents around imagery, always decorative, never meaning-bearing on their own per Section 2's contrast law.
  - Soft radial-gradient glows in low-alpha Palm or gold behind sections: barely-there, atmospheric, never a loud gradient background.
  - Pill CTAs (`border-radius: 999px`) with a soft green shadow, and floating pill-shaped chips for tags and labels.
- **Elevation stays flat and tone-separated at rest.** Cards, sections, and forms are distinguished by Coconut, Leaf Tint, or Evergreen tone, not by permanent drop shadow. A soft shadow appears only as a response to interaction, using `rgba(14,61,43,0.12)` to `rgba(14,61,43,0.28)`.

### Named Rules

**The Soft-Geometry Rule (new, replaces any true-3D register).** Depth and visual interest come entirely from organic blob masks, thin gold rings and dots, soft radial glows, pill shapes, and big rounded section tops: all two-dimensional, all GPU-cheap. There is no true-3D or perspective-transform register in this system; do not reach for `perspective`, `translateZ`, or a WebGL layer to create depth. Depth is a matter of layout, shape, and shadow, not a third axis.

**The Flat-Until-Touched Rule (kept).** Everyday cards and surfaces sit flat at rest, separated by tone. A soft shadow appears only on hover, focus, or for genuinely floating elements (menus, dialogs). No permanent drop-shadows on every card.

**The Enhancement-Not-Gate Rule (kept).** Motion enhances an already-visible, already-usable page. Never gate content visibility on a reveal transition; it fails on reduced-motion, hidden tabs, and headless renderers. Every effect has a `prefers-reduced-motion` fallback: a calm crossfade or a static state.

## 5. Motion

Motion in this system is **restrained, two-dimensional choreography only.** There is no true-3D or WebGL motion register; depth comes from the Soft-Geometry shapes in Section 4, not from perspective or camera movement.

- **Hero:** headline lines slide up and fade, staggered about 80ms apart; the blob-masked hero image scales in from 0.96 with a soft ease; a gold ring draws in around it.
- **On scroll:** section eyebrows and headings fade and rise once, triggered at roughly 20% of the viewport; sequences like admissions steps or news rows stagger in top-to-bottom.
- **On hover:** buttons lift about −2px with a deepened shadow; list rows such as news items nudge about +4px to the right with a Leaf Tint wash.
- **Easing:** the system has exactly **one canonical named easing**, `--ease-grove: cubic-bezier(0.22, 1, 0.36, 1)`, run over 500 to 700ms. It should read as buttery, never bouncy. Where `app/globals.css` already ships another named ease (`--ease-out-expo`, kept for existing components), `--ease-grove` is the one this document authorizes for brand motion; do not introduce a third.
- **Reduced motion:** every effect honors `prefers-reduced-motion` with a calm crossfade or a static, fully-legible state. Content is complete and usable before any motion runs, per the Enhancement-Not-Gate Rule.
- **Stack:** the `motion` package for choreographed entrances and scroll-driven reveals, plus `tw-animate-css` for small micro-transitions where a full Motion component would be overkill. There is no React Three Fiber, no WebGL, and no perspective-based parallax anywhere in this system.

## 6. Dark Mode

Dark mode is its own deliberately designed register, not an automatic inversion of the light rules. The comp this system is drawn from is light-only, so the figure-ground logic must be re-derived rather than "same rules, darker":

- The ground stays a near-black, green-tinted surface (`--background` around `oklch(0.16 0.006 155)` in `app/globals.css`). There is no light canvas in dark mode, so the Coconut, Leaf Tint, and full-Evergreen alternation from Section 4 does not translate literally; there is nothing to alternate down to.
- Structural green sections must use a **lightened evergreen**, not the literal `#0E3D2B`, so they read as lit objects against the near-black ground. A true `#0E3D2B` at about 0.34 lightness sits too close to a 0.16 ground and effectively vanishes. Push the dark-mode evergreen surface up to roughly `oklch(0.30 to 0.40 L)`.
- The light-mode "Leaf Tint break" register is replaced by a subtly **elevated dark surface**, a card or `--muted` step up from the ground, rather than a light box dropped onto a dark page.
- Palm and Piña Gold both lighten slightly in dark mode to hold their contrast against the darker ground.
- Every ground-keyed rule from Section 2 still applies in dark mode; re-verify each pairing against the darker values rather than assuming the light-mode verdicts carry over unchanged.

## 7. Interior and Long-Form Pages

The reference comp is a single homepage, and its density of serif headlines and eyebrow kickers is tuned for that fold-by-fold, editorial rhythm. On text-dense interior or long-form pages (admissions requirements, policy pages, long-form news articles), that density becomes noise. On those pages:

- Reduce eyebrow-kicker frequency; reserve it for genuine section breaks, not every subheading.
- Lean harder on Hanken Grotesk for headings below the Instrument Serif size floor rather than forcing serif everywhere a heading appears.
- Keep the same palette, contrast law, and motion discipline as the rest of the site; only the density of display typography and kickers changes.

## 8. Components

No component library exists yet beyond the base shadcn set; components will be documented on the next scan-mode run once the redesigned homepage and shared UI are built. When they are, expect:

- A **Palm primary pill button** (`border-radius: 999px`) with a soft green shadow that deepens on hover and lifts about −2px.
- A single **gold pill CTA**, used at most once per view, reserved for an evergreen ground per the contrast law.
- Warm Coconut and Leaf Tint cards separated by tone, not permanent shadow, with a soft shadow appearing only on hover or focus.
- Inputs with a Palm focus ring.
- A navigation that keeps the eyebrow-style "Contact" or "Inquire Now" path always visible.
- A blob-masked image treatment with a thin gold ring accent for featured photography (hero, achievement, and feature-reveal moments).
- Serif step numerals (01, 02, 03) in Piña Gold for numbered sequences such as an admissions process, always on an evergreen ground per Section 2.

## 9. Do's and Don'ts

### Do:
- **Do** let green carry 30 to 60 percent of the page by massing into full evergreen structural sections, not just a button or two.
- **Do** reserve gold for fine detail: labels, numerals, dots, rings, and exactly one CTA on an evergreen ground.
- **Do** verify every color pairing against the Section 2 contrast matrix before shipping it; the system has no headroom to spare.
- **Do** keep gold as text only on evergreen, and Palm emphasis only on light grounds.
- **Do** use Instrument Serif for every headline at or above the roughly-24px floor, and Hanken Grotesk semibold for anything smaller.
- **Do** use the eyebrow-kicker device above section headings as a deliberate, embraced signature, without a mid dot separator.
- **Do** lead with real photography of Guardians, blob-masked with a thin gold ring, as the primary source of warmth and trust.
- **Do** keep contact one tap or scroll away from any page.
- **Do** honor `prefers-reduced-motion` with a calm crossfade or instant alternative for every animation.
- **Do** keep motion restrained, two-dimensional, and built on the single `--ease-grove` easing.
- **Do** reduce eyebrow and serif density on text-dense interior pages per Section 7.

### Don't:
- **Don't** drift into generic corporate or SaaS gloss: no gradient-blob heroes, sterile stock imagery, or endless identical feature-card grids.
- **Don't** ship a dated, clip-art school website: no clutter, rainbow or outlined text, tiled or busy backgrounds, marquees, or comic-sans energy.
- **Don't** go cold and institutional: no gray government-portal feel or bureaucratic form dumps; even official info stays human.
- **Don't** demote green to a timid accent on an otherwise gray page, and don't let every section go evergreen with no coconut left to breathe: both violate the Committed Green Rule.
- **Don't** set gold as text, a numeral, or a meaning-bearing dot on Coconut or Leaf Tint; it fails contrast there. Gold text lives on evergreen only.
- **Don't** set Palm as an emphasis word or accent dot on an evergreen ground; it fails contrast there. Use gold or light `#E9F1EA` instead.
- **Don't** fill, gradient, or tile the gold, or use more than one gold CTA in a single view.
- **Don't** run headline-weight Instrument Serif below the roughly-24px floor; switch to Hanken Grotesk semibold instead.
- **Don't** use the interpunct (`·`) or an em dash (—) anywhere in site copy, including inside the eyebrow-kicker device; use commas, periods, colons, or a styled dot element instead.
- **Don't** reach for true 3D, perspective transforms, or a WebGL layer for depth; the Soft-Geometry Rule covers depth with shapes, rings, glows, and shadow only.
- **Don't** apply motion or shape flourishes uniformly to every element; reserve them for genuine section breaks and signature moments so they keep reading as craft, not noise.
- **Don't** gate content behind a reveal animation, or let motion hurt performance, legibility, or accessibility. Impressive must never cost usable.
