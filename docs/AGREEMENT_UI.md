# Agreement storefront design

The public homepage and `/rent-agreement` now share `AgreementLanding`. `AgreementChrome` supplies the compact navigation and footer for agreement, customer-order, partner and authentication pages. Rental management retains its existing navigation and components.

The storefront follows the real service: enter details and upload proofs, pay, admin verification, city partner preparation, admin approval, then PDF download or paid courier delivery. It avoids demo prices, simulated tracking results, automatic e-sign promises and promotional popups.

Design reference: https://github.com/gautams1512-glitch/NullMotion

Reviewed the reference's `public/demo.css`, `public/tokens.css` and `public/drafts.mjs`. Applied its restrained typography, thin rules, single warm accent and staggered entrance rhythm to an original light-theme implementation using the project's existing Framer Motion dependency. No reference footage, brand artwork, GSAP bundle or exporter is included in the application.

Homepage now has start, agreement types, three-step process, benefits, pricing/delivery, partners and FAQs. Package prices come from the existing backend configuration; unavailable pricing is shown as final price at checkout, without a fabricated fallback. City, agreement type and delivery preferences are carried into the wizard. Mumbai maps to Maharashtra, Bangalore to Karnataka, and other listed cities map to their state.

Accessibility: labelled city selector, pressed states on option buttons, visible keyboard focus, native FAQ disclosure controls, skip link, mobile navigation with expanded state, and reduced-motion handling.

Browser checks: desktop hero, 390-pixel mobile layout without horizontal overflow, mobile menu, commercial/Mumbai/hard-copy handoff and wizard property defaults. TypeScript validation also passes.

Final production validation: Next.js build passes, including lint/type validation and generation of all 68 pages. The changed UI files pass `git diff --check`.

## Connected product navigation

`ProductSwitcher` links Rental Agreement (`/`) and Rental OS (`/rental`) in both headers and footers, with the active product indicated. A visible second header row provides switching on mobile. Existing Rental OS feature sections, marketplace, owner/tenant portals, tools and walkthrough remain available. Its typography, cards, background and search controls now follow the quieter storefront style with a green product accent. `RentalFooter` groups property, management and tools links; the agreement footer includes residential/commercial forms, partner access and Rental OS destinations.

English, Hindi and Gujarati use the existing persisted language context. New agreement content, rental navigation, principal rental sections, FAQs and wizard headings use `storefront-copy.ts`; legacy detailed dashboard fields and the demo walkthrough retain their existing text. The wizard uses the shared preference rather than a separate two-language toggle. The document language attribute follows the selection.

Added agreement-type cards, benefits, partner workflow and an itemised service/delivery pricing section. Applicable duty, taxes and optional services are explicitly reserved for final checkout. Partner onboarding leads to Contact; approved partners sign in to their existing dashboard.

Rental category buttons now select the search property type. City/type and minimum/maximum budget are passed to `/properties` and applied to the existing marketplace API. Budget constraints are visible and can be cleared. Browser verification used Ahmedabad, PG and a ₹10,000 maximum, returning the matching ₹7,800 listing; no booking or payment was submitted. Switching in both directions retained Hindi. Agreement mobile layout at 390 pixels had matching client/scroll width (385 pixels after scrollbar).
