# Roadmap: Premium Portfolio Evolution

Refining the `my-portfolio` project with advanced Next.js 15/16 patterns and high-performance motion design.

## 1. Project Case Study Interception
**Skill:** Next.js Best Practices + Scroll Experience
- **Feature:** Implement "Intercepted Routes" for project details. When clicking a project, a full-screen case study slides up as a modal (maintaining the URL), but a hard refresh loads a dedicated page.
- **Action:** Use `@modal/(.)projects/[id]` structure.
- **Impact:** Cinematic navigation that keeps the user context while deep-linking content.

## 2. Server-Side Contact Engine (React 19)
**Skill:** Kaizen + Next.js Best Practices
- **Feature:** Refactor the current Contact form to use **Server Actions** and the new React 19 `useActionState`.
- **Action:** Implement a `submitContact` action with Zod validation. Add a studio-quality "Success" animation that replaces the form upon completion.
- **Impact:** Robust, zero-JS-interactable (progressive enhancement) form with premium feedback.

## 3. Magnetic Interaction System
**Skill:** Frontend Design + Scroll Experience
- **Feature:** Implement "Magnetic" hitboxes for high-priority CTAs (Navbar links, Social icons, Contact button).
- **Action:** Add a high-performance hook that calculates proximity and applies a subtle "pull" transform to elements as the cursor nears.
- **Impact:** Makes the interface feel tactile and highly responsive to user intent.

## 4. Performance & Semantic Hardening
**Skill:** SEO Audit + Kaizen
- **Feature:** Implement dynamic OpenGraph images and JSON-LD schema.
- **Action:** Add `app/api/og/route.tsx` to generate bespoke social sharing cards for every project.
- **Impact:** Professional social presence and elite search engine visibility for "Graphic Designer / Video Editor" keywords.

---

### Which of these would you like to tackle first? 
I recommend starting with **#1 (Project Interception)** as it has the biggest "WOW" factor for potential clients.
