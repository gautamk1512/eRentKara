# Premium interface system

The app now shares an original design inspired by the typography, spacious product presentation and restrained navigation of https://www.apple.com/in/. No Apple artwork or assets are bundled.

## Coverage

- Root `PremiumExperience` and `premium.css` reach every frontend route: marketing, agreement wizard, pricing, property marketplace/detail, registration, identity verification, customer orders, legal partner, owner/tenant/kiosk, admin and all rental tools.
- `PremiumNavigation` supplies a translucent header, product switch, language control, grouped service menu and mobile drawer. `product-navigation.ts` keeps product selection, footer and accents consistent, including SaaS pricing and account portal links.
- Rental workspace has a light sidebar, active navigation, breadcrumbs and a mobile menu containing every workspace section. The nonexistent settings link is replaced by the actual help guide.
- Customer and partner pages use reusable page headers and empty states. Existing page cards, form controls, table spacing and semantic status badges receive shared styling.
- Django Unfold uses an app static stylesheet registered via `UNFOLD.STYLES`; native forms and light/dark mode remain available.

## Motion & accessibility

Framer Motion is already installed. The global MotionConfig respects reduced-motion preference. A progressive IntersectionObserver adds subtle Web Animations entrance effects to sections, articles and headings without hiding content in the absence of JavaScript. It skips elements already animated by Framer Motion and cleans up observers/animations on navigation. No scroll interception is used.

Controls have focus rings, labels and visible disabled states. The header dropdowns use native details; Escape closes menus. Mobile workspace exposes all sections. Chat uses an icon-sized trigger on mobile and a viewport-bounded panel with an accessible name. Semantic status colours and dark table contrast are retained.

## Verification

- Next production build passes with lint and TypeScript validation; 68 pages generated.
- Django system check: zero issues. Static finder locates the admin stylesheet; anonymous admin login renders HTTP 200 with the stylesheet link.
- Browser rendering audit of all 62 static routes at 390 × 844: shared navigation present, client and document scroll widths both 385 px after scrollbar.
- Six dynamic layouts checked: existing public property detail and city page, plus invalid-token/authentication states for order detail, invitation and verification. No authenticated order preparation or admin mutation was performed.
- Desktop visual checks: both landing pages, workspace, pricing and tools. Mobile visual checks: both products, tool form and expanded workspace navigation. Product switching, persisted language and category/city/budget handoff were checked previously.

## Route inventory

- `/about`
- `/admin`
- `/admin/properties`
- `/admin/rent-agreements`
- `/agreement/create`
- `/agreement`
- `/blog`
- `/contact`
- `/dashboard/agreements`
- `/dashboard/ai`
- `/dashboard/complaints`
- `/dashboard/invoices`
- `/dashboard/leads`
- `/dashboard/mess`
- `/dashboard/orders/[orderNumber]`
- `/dashboard/orders`
- `/dashboard`
- `/dashboard/properties`
- `/dashboard/referrals`
- `/dashboard/reports`
- `/dashboard/staff`
- `/dashboard/tenants`
- `/dashboard/visitors`
- `/faq`
- `/features`
- `/guide`
- `/list-your-property`
- `/login`
- `/owner/dashboard`
- `/owner/verification`
- `/`
- `/partner/agreements`
- `/pricing`
- `/promotions`
- `/properties/[slug]`
- `/properties`
- `/property-in/[city]`
- `/register`
- `/rent-agreement/create`
- `/rent-agreement/help`
- `/rent-agreement/invite/[token]`
- `/rent-agreement/old-agreement`
- `/rent-agreement`
- `/rent-agreement/pricing`
- `/rent-agreement/renew`
- `/rent-agreement/verify/[token]`
- `/rent-agreement-ai`
- `/rental`
- `/shop/dashboard`
- `/solutions`
- `/start-managing-free`
- `/tenant/dashboard`
- `/tenant`
- `/tenant/verification`
- `/tools/deposit-receipt-generator`
- `/tools/electricity-bill-calculator`
- `/tools/move-out-settlement-calculator`
- `/tools`
- `/tools/pg-hostel-revenue-break-even-calculator`
- `/tools/rent-agreement-generator`
- `/tools/rent-receipt-generator`
- `/tools/tenant-kyc-admission-form-generator`
- `/tools/tenant-police-verification-form-generator`
- `/user-manual`
- `/verification/aadhaar`
- `/verification`
- `/verification/status`
- `/verify/agreement/[id]`
