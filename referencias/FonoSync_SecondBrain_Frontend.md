# FonoSync — Second Brain / Frontend Rebuild Brief

## Goal
Rebuild the FonoSync frontend and establish a distinctive, consistent brand and visual system. Use the **Impeccable** skill in the IDE for design critique and implementation. This document is the project context and should be consulted before decisions or code changes so the AI keeps the same direction across sessions.

## Current context
- Existing app: FonoSync, a speech-language pathology (fonoaudiology) platform.
- Current public landing page includes: header with logo, navigation (Sobre, Recursos, Benefícios), accessibility control, page-reading feature, and sign-in; dark-blue hero with large headline and metrics illustration; sections for families, speech-language pathologists, schools, and networks; feature cards and ecosystem content.
- Current design is perceived as too generic/AI-generated: typography feels generic, many simple/generic SVG or icon treatments, buttons follow a familiar AI-template look, and visual content is sparse/abstract.
- Rebuild the frontend; do not change backend functionality, routes, API contracts, authentication, or working features unless explicitly requested. Preserve functionality and audit existing structure before replacing UI.

## Visual direction
- **Professional, warm, human, health-focused, polished.**
- Shift toward lighter colors and an airy layout; keep blue as a brand anchor, but reconsider the current dark-heavy hero and low-contrast/saturated patterns.
- Increase typography scale and readability. Avoid default/generic-looking font choices. Choose a deliberate display font + body font pairing with character, legibility, and clinical professionalism. Define hierarchy, sizes, weights, line-height, and responsive behavior consistently.
- Make FonoSync feel like a product with its own identity, not an AI-generated SaaS template.
- Create a coherent design system: colors, typography, spacing, radii, borders, shadows, layouts, buttons, states, forms, cards, tabs, navigation, and responsive breakpoints.
- Avoid repetitive cards/sections and excessive boxed UI. Use editorial composition, real whitespace, visual storytelling, and hierarchy.

## Photography and visual assets
- Add professionally art-directed photography of speech-language pathologists (fonoaudiólogos/terapeutas da fala) and real care contexts, with diverse and respectful representation.
- Prefer generated/custom images created specifically for FonoSync's brand and page content over generic stock or unrelated images.
- For illustrations or product visualizations, generate bespoke assets based on the FonoSync platform and actual feature concepts; do not use generic keyboard imagery or generic AI dashboard art.
- Remove simple/generic SVG decoration and generic icon packs as visual substitutes for meaningful imagery. Icons may be used only when they communicate a necessary UI action or affordance, and should be deliberate, consistent, and non-decorative. Do not use generic iconography as the main illustration for feature sections.
- Do not fabricate screenshots of features that do not exist. If a custom product illustration is needed, base it on real FonoSync flows and clearly keep it illustrative.

## Components and patterns to avoid
- Generic AI/SaaS landing page layout and visual clichés.
- The familiar rounded-pill/gradient/soft-shadow “AI button” look. Buttons should have FonoSync-specific shape, scale, color, states, and interaction patterns. Avoid making every CTA a capsule.
- Overly small text. Increase heading/body/button sizes and ensure mobile readability.
- Generic keyboard, simple SVG, stock icon, or decorative icon-driven cards.
- Unnecessary icons, visual noise, or repeated UI containers.

## Content / product alignment
- FonoSync is about speech-language development, care, and continuity between families, professionals, and institutions.
- Current audience structure: families/individuals, speech-language pathologists, schools, and networks.
- Keep the language clear, empathetic, credible, and clinically grounded; avoid unsupported claims, invented statistics, or fake testimonials.
- Preserve accessibility controls and the page-reading functionality; design them as first-class UI, not decorative toolbar elements.

## Reference
Primary inspiration URL provided by the user:
- https://doxy.me/site/?ref=land-book.com

Use it to study visual composition, rhythm, typography, healthcare professionalism, imagery, content hierarchy, and page sections. **Inspiration only: do not copy the page, its text, branding, source code, or proprietary assets.**

The user's request was to save the page HTML as a local reference. A direct HTML download attempt from this environment failed. If obtaining source is needed in Carbon/IDE, use the IDE/browser's permitted inspection or a command such as `curl -L 'https://doxy.me/site/?ref=land-book.com' -o doxy-reference.html` (if network access is available), then use it only to inspect structure and patterns; respect the website's terms and do not reproduce it wholesale. A practical fallback is a reference-notes file with screenshots and observations rather than storing or copying the entire site source.

## Workflow for the IDE agent (Carbon)
1. Read this file and inspect the existing repository, routes, components, CSS, assets, and current responsive behavior before editing.
2. Use **Impeccable** for critique and implementation. If another installed skill is available, do not use it unless the user asks.
3. Make a concise audit: identify the visual problems, current functional components that must be preserved, and the proposed new visual system.
4. Establish the FonoSync tokens and reusable components before rebuilding page sections.
5. Replace generic visual assets with custom FonoSync-specific generated imagery where appropriate; ensure imagery supports the content.
6. Redesign page sections, typography, navigation, CTA buttons, cards, and tabs consistently; increase text scale and improve mobile-first responsive layout.
7. Keep working behavior intact. Verify links, buttons, accessibility controls, page-reading, forms, navigation, and responsive layouts.
8. Avoid large destructive rewrites until the current structure and functionality have been understood. Prefer incremental, reviewable changes.
9. At the end, report what changed, any preserved features, missing assets, implementation decisions, and checks performed.

## Non-negotiable design checklist
- [ ] Distinct FonoSync identity; not a generic AI template
- [ ] Larger, legible typography and intentional font pairing
- [ ] Lighter palette with sufficient contrast and clear hierarchy
- [ ] Professional speech-language pathology photography
- [ ] Custom FonoSync-specific generated visual assets, not generic AI/keyboard/icon illustrations
- [ ] Remove generic/simple SVG icon decorations; only retain icons for meaningful controls
- [ ] Rework button design; avoid generic pill CTA patterns
- [ ] Design system and consistent patterns across the site
- [ ] Accessibility and page-reading features retained and refined
- [ ] Mobile-first responsiveness checked
- [ ] Existing functionality/routes/API integrations preserved
- [ ] No fake clinical claims, statistics, testimonials, or feature mockups presented as real
