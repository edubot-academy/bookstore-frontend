# EduBook Frontend Changelog

This changelog documents the frontend evolution of the existing bookstore UI into the EduBook Phase 1 educational bookstore customer and admin experience.

The active frontend principle remains:

> The first usable product is a reliable education-focused bookstore. Rental, course bundles, EduBot Learning, EduPro CRM, AI recommendations, marketplace behavior, and advanced integrations stay inactive until the roadmap reaches those phases.

## 2026-05-12 - v0.2.0: Marketing, SEO, and Visibility Pass

### Version

- Bumped frontend package version to `0.2.0`.
- This is the second frontend release.

### Brand and Asset Integration

- Replaced legacy placeholder imagery with the new education-focused visual asset set.
- Updated homepage sections to use the new:
  - hero school supplies image
  - category images
  - article images
  - promo banner image
  - featured book image
- Removed unused legacy Vite/React/sample bookstore assets from active imports.
- Updated navbar/footer logo presentation for the new public logo.
- Added Vercel SPA routing fallback in `vercel.json` so direct navigation and refreshes work on deployed client routes.

### Homepage Funnel

- Reworked the homepage into a stronger customer acquisition flow:
  - hero
  - guided book finder
  - categories
  - promo campaign
  - new releases
  - featured recommendations
  - articles
  - how-it-works/trust flow
- Replaced internal/customer-unsafe wording such as `EduBook MVP`.
- Rewrote promo copy from placeholder text into customer-facing campaign copy.
- Added stronger WhatsApp consultation CTAs across homepage and campaign areas.
- Added real operational contact details:
  - phone: `+996 222 089 5285`
  - pickup address: `Akhunbaev 129B, Бишкек`
  - working hours: `Күн сайын 09:00-20:00`
  - 2GIS search link for the pickup address

### Guided Book Finder

- Added a homepage guided book finder for:
  - user type
  - learning goal
  - level intent
  - language
- Finder routes users into filtered catalog views using reliable backend-facing params.
- Removed risky generated `gradeLevel` URL values after review because backend book records may not use exact Kyrgyz level strings.

### Catalog Conversion and URL Fidelity

- Added catalog quick filters for high-intent education categories:
  - English learning
  - exam prep
  - programming
  - children education
- Added a WhatsApp help block beside catalog filters.
- Improved catalog search placeholder copy.
- Catalog URL state now preserves and restores:
  - `minPrice`
  - `maxPrice`
  - `sort`
  - `page`
- Browser back/forward and shared catalog URLs now retain more of the active filter state.

### Articles and Editorial Content

- Added article detail pages at `/articles/:slug`.
- Moved article metadata/content into shared `src/data/articles.ts`.
- Article cards now open article detail pages instead of only catalog filter URLs.
- Added practical, educational article content for:
  - English workbook selection
  - beginner programming books
  - exam prep materials
  - IELTS prep books in Bishkek
  - learning center book bundle planning
- Added article page CTAs to relevant catalog/bundle routes and WhatsApp consultation.
- Added related article links.

### SEO and Social Metadata

- Updated `index.html` with production-facing:
  - language
  - title
  - description
  - theme color
  - Open Graph defaults
- Added reusable client-side `SEO` component for route metadata.
- Added canonical domain configuration for:
  - `https://edubook.edubot.it.com`
- Added static SEO files:
  - `public/robots.txt`
  - `public/sitemap.xml`
- Added JSON-LD structured data for:
  - local business
  - article pages
  - book/product pages
- Added Vercel bot-specific rewrites for social crawlers:
  - `/articles/:slug`
  - `/books/:id`
- Added serverless metadata handlers:
  - `api/article-meta.js`
  - `api/product-meta.js`
- These handlers provide crawler-readable HTML metadata for known article routes and backend-backed book routes.

### Routing and Navigation

- Reintroduced public bundle routes:
  - `/bundles`
  - `/bundles/:id`
- Added bundle navigation where it supports the new marketing flow.
- Removed the duplicate text cart link from the desktop/header nav while keeping icon cart access.
- Fixed navbar active state so `Башкы бет` and `Макалалар` are not active at the same time.
- `Макалалар` is active for:
  - `/#articles`
  - `/articles/...`

### Business Info Centralization and Tracking Hooks

- Added shared business configuration in `src/lib/business.ts`.
- Replaced old placeholder phone/address values across visible customer pages.
- Added lightweight `trackEvent` helper compatible with `gtag` or Plausible when analytics is installed later.
- Added tracking hooks for key marketing interactions such as:
  - hero catalog click
  - hero WhatsApp click
  - promo clicks
  - guided finder submit
  - catalog quick filters
  - catalog WhatsApp help

### Verification

- Confirmed `npm run lint` passes.
- Confirmed `npm run build` passes.
- Confirmed Vercel metadata handler modules import cleanly in Node.
- Current build warnings remain non-blocking stale browser data notices:
  - `baseline-browser-mapping`
  - `caniuse-lite` / Browserslist DB

## 2026-05-11 - v0.1.0: First Frontend Release

### Version

- Marked the first frontend release as `0.1.0`.
- Includes all pre-v0.2.0 work: repository audit, API contract alignment, customer bookstore flow, UX/UI direction, admin UI, localization, error handling, and frontend hardening.
- This release stabilized the Phase 1 bookstore flow before the later marketing/SEO pass.

### Environment Configuration

- Updated `.env.example` to document the actual frontend runtime API URL:
  - `VITE_API_BASE_URL=http://localhost:4000/api`
- Aligned the example with `.env` and the Axios fallback in `src/lib/api.ts`.
- Clarified that the API base URL should include `/api` because frontend calls append endpoint paths such as `/books`.

### Cart Persistence

- Fixed cart hydration so saved cart contents are not overwritten during initial app mount.
- `CartProvider` now initializes state directly from `localStorage` before the persistence effect runs.

### Admin Route Guard

- Added a frontend guard for `/admin`.
- The admin route now:
  - waits for auth loading to finish
  - redirects unauthenticated users to `/login`
  - redirects non-admin users to `/`
- This complements backend authorization and prevents direct navigation from mounting the admin UI for ordinary users.

### Auth and API Error Handling

- Removed the global hard redirect from the shared Axios response interceptor.
- Kept 401 cleanup in the auth provider so route-level guards control navigation.
- Trimmed login and registration payload fields before sending them to the backend.

### Catalog Filtering

- Moved availability filtering into the `/books` API query params:
  - `available`
  - `low`
  - `out`
- Removed page-local availability filtering so pagination and totals are no longer computed from an already-paginated subset.
- Backend should support the `availability` query param for this filter to work consistently across all pages.

### Verification

- Confirmed `npm run build` passes.
- Confirmed `npm run lint` passes.
- Current build warnings are non-blocking stale browser data notices:
  - `baseline-browser-mapping`
  - `caniuse-lite` / Browserslist DB

### 2026-05-10 - Repository Audit and Product Direction

#### Audit Result

- Audited the existing frontend as part of the EduBook plan.
- Decision: continue with the repo instead of rebuilding from scratch.
- Original frontend readiness was limited because:
  - some public pages used mock data
  - book detail/cart/checkout/order success flow was missing or incomplete
  - frontend `Book` types did not match backend `Book` responses
  - admin forms sent backend-incompatible payloads
  - order update method did not match backend
  - admin order UI expected richer order responses than backend originally provided

#### Direction Adopted

- EduBook should feel like an education bookstore, not a generic ecommerce template.
- Primary customer groups:
  - students
  - parents
  - teachers
  - course centers
  - self-learners
- First release scope:
  - browse books
  - search/filter catalog
  - view book details
  - cart
  - checkout
  - pickup/delivery choice
  - manual confirmation by phone/WhatsApp
  - admin book/category/author/order management

### 2026-05-10 - Patch 1: API Contract and Build Stabilization

#### Build Fixes

- Fixed TypeScript/build errors so the frontend can compile.
- Confirmed `npm run build` passes.
- Confirmed `npm run lint` passes.
- Current local warning remains:
  - Node is `20.17.0`
  - Vite recommends `20.19+` or `22.12+`

#### Book Type Alignment

- Updated frontend assumptions to match backend `Book` shape.
- Standardized active UI around:
  - `coverUrl`
  - `authors`
  - `category`
  - `stock`
  - `price`
  - education metadata
- Stopped using legacy assumptions like:
  - `author`
  - `image`
  - `url`

#### Admin Book Payload Alignment

- Updated admin book save flow to match backend DTO.
- Current admin book payload uses:
  - `title`
  - `description`
  - `price`
  - `coverUrl`
  - `authorIds`
  - `categoryId`
  - `stock`
  - education metadata fields
- Removed legacy payload fields from active admin save behavior:
  - `imageUrl`
  - `images`
  - `authorId`
  - `isPublished`
  - `sku`

#### Admin Order Contract

- Updated admin order update call to use:
  - `PUT /admin/orders/:id`
- Aligned admin order UI to consume:
  - nested customer data
  - nested delivery/pickup data
  - order items
  - totals
  - payment status
  - internal notes

#### Checkout DTO Alignment

- Checkout now sends backend-compatible create-order DTO:
  - `items`
  - `fulfillmentType`
  - `contact.fullName`
  - `contact.phone`
  - `contact.email` optional
  - `deliveryAddress` when delivery
  - `paymentMethod`
- Guest checkout is preserved.
- Email remains optional.
- Phone remains required.

### 2026-05-10 - Patch 2: Real Customer Bookstore Flow

#### Active Customer Routes

- Added/registered the real bookstore route flow:
  - `/`
  - `/catalog`
  - `/books`
  - `/books/:id`
  - `/cart`
  - `/checkout`
  - `/order-success/:orderNumber`
  - `/login`
  - `/register`
  - `/profile`
  - `/admin`
  - fallback not-found route

#### Catalog

- Public catalog uses real backend `/api/books` data.
- Catalog supports backend-facing query/filter concepts such as:
  - search query
  - category
  - author
  - language
  - subject
  - grade level
  - book type
  - min/max price
  - sort
  - pagination
- Catalog cards use backend book fields:
  - title
  - price
  - cover image
  - authors
  - category
  - stock

#### Book Detail

- Added real book detail page at `/books/:id`.
- Displays:
  - cover image
  - category
  - title
  - authors
  - price
  - stock/availability state
  - description
  - subject
  - language
  - grade/level
  - book type
  - publisher
  - edition
  - ISBN
  - target audience
  - pickup/delivery/manual confirmation messaging
- Supports add to cart.
- Supports WhatsApp question link.

#### Cart

- Added local frontend cart state.
- Cart persists with `localStorage`.
- Cart supports:
  - add item
  - increase/decrease quantity
  - remove item
  - subtotal calculation
  - checkout navigation
- Cart clears only after successful backend order creation.

#### Checkout

- Added checkout form.
- Supports:
  - contact name
  - phone
  - optional email
  - pickup or delivery
  - delivery address when delivery selected
  - cash/manual transfer payment method
  - order summary
- Checkout posts to backend order creation endpoint.
- Checkout displays backend validation errors more clearly after later error handling improvements.

#### Order Success

- Added order success page.
- Reads order number from route param.
- Reads public access token from query string.
- Fetches public order details when accessible.
- Shows:
  - order number
  - customer
  - ordered books
  - fulfillment method
  - total
  - WhatsApp follow-up link
- Keeps MVP expectation clear: team confirms availability and delivery/pickup manually.

### 2026-05-10 - EduBook UX/UI Direction

#### Visual Direction

- Adopted EduBot ecosystem-inspired visual tokens.
- Tailwind theme includes:
  - `edubot.dark`
  - `edubot.orange`
  - `edubot.green`
  - `edubot.soft`
  - `edubot.teal`
  - `edubot.ink`
  - `edubot.surface`
  - `edubot.surfaceAlt`
  - `edubot.line`
  - `edubot.muted`
  - `edubot.warning`
  - `edubot.danger`
- Added shadows:
  - `edubot-card`
  - `edubot-soft`
  - `edubot-glow`
  - `edubot-hover`
  - `edubot-hover-soft`
- Added dashboard utilities:
  - `dashboard-panel`
  - `dashboard-panel-muted`
  - `dashboard-pill`
  - `dashboard-field`
  - `dashboard-select`
  - `dashboard-button-primary`
  - `dashboard-button-primary-lg`
  - `dashboard-button-secondary`

#### Customer UI Improvements

- Updated customer-facing pages to use a more education-focused tone.
- Improved:
  - homepage composition
  - catalog density and filtering
  - book cards
  - empty states
  - loading states
  - pagination
  - search bar
  - navigation
  - footer
  - auth pages
  - profile page
  - cart page
  - checkout page
  - order success page
- Replaced generic ecommerce copy with bookstore/education language.
- Kept MVP messaging honest:
  - no online payment required
  - manual confirmation
  - pickup or delivery
  - WhatsApp/phone confirmation acceptable

#### Mobile and Responsive Improvements

- Improved responsive layouts across customer and admin pages.
- Added compact but readable admin tab layout.
- Improved sticky checkout/order summary behavior.
- Improved grid behavior for book cards and admin panels.
- Added loading skeletons and empty states where useful.

### 2026-05-10 - Admin UI Improvements

#### Admin Shell

- Improved admin page visual hierarchy.
- Added icon-based tabs.
- Active Phase 1 admin navigation now focuses on:
  - dashboard
  - orders
  - books
  - categories
  - authors
  - Home CMS
  - settings notice
- Later-phase Rentals/Bundles tabs are no longer active in navigation.

#### Books Admin

- Book form now supports core bookstore data:
  - title
  - price
  - author
  - category
  - stock
  - cover image
  - description
- Book form now supports education metadata:
  - subject
  - language
  - grade/level
  - book type
  - ISBN
  - publisher
  - edition
  - target audience
- Category is now required in the UI to match backend validation.
- Cover image upload uses backend admin upload endpoint.

#### Orders Admin

- Orders table displays:
  - order number
  - customer
  - phone/email
  - delivery/pickup method
  - item count
  - total
  - status
  - payment status
  - created date
- Filters include:
  - text search
  - status
  - date from
  - date to
- Order detail drawer displays:
  - status update control
  - payment status control
  - customer details
  - delivery details
  - item details
  - totals
  - internal notes
- Admin order update uses backend `PUT` endpoint.

#### Categories and Authors Admin

- Polished management screens for categories and authors.
- Kept forms simple and aligned with backend endpoints.
- Improved empty/loading/error states.

#### Dashboard

- Improved admin dashboard presentation.
- Uses backend report/dashboard data when available.
- Provides a cleaner operational overview for orders, stock, and sales.

#### Home CMS

- Home CMS tab is secondary for the MVP.
- It now uses existing backend contract:
  - reads from `/homepage`
  - saves to `/admin/homepage`
- Avoids calling nonexistent `/admin/cms/home`.
- Supports future-use homepage content:
  - hero slides
  - banners
  - featured book selection
- Current customer flow does not depend on Home CMS to sell books.

#### Settings

- Settings tab no longer calls nonexistent `/admin/settings`.
- It now displays read-only operational placeholders and explains:
  - store settings are not database-backed yet
  - Telegram notification settings are optional
  - EduBot/EduPro/CRM integrations remain deferred

### 2026-05-10 - Future-Use Component Polish

The repo had old or inactive UI sections. Instead of deleting all of them, future-use components were polished so they remain visually compatible if reintroduced later.

#### Polished Future-Use Components

- `ArticlesSection`
- `CategoriesSection`
- `FeaturedBookSection`
- `HeroSection`
- `NewReleasesSection`
- `Newsletter`
- `PromoBanner`
- `TopBar`

#### Current Usage Decision

- These components are not all part of the active customer route flow.
- They are retained because they may be useful for:
  - future homepage marketing sections
  - educational editorial content
  - campaigns
  - featured categories
  - newsletter/contact capture
- They should not be expanded into a CMS-heavy launch blocker.

### 2026-05-10 - Deferred Rental and Bundle UI

#### Files Kept for Later

- `src/pages/BundlesPage.tsx`
- `src/pages/BundlePage.tsx`
- `src/pages/admin/tabs/BundlesTab.tsx`
- `src/pages/admin/tabs/RentalsTab.tsx`

#### Active Runtime Decision

- Public bundle routes were removed from active routing:
  - `/bundles`
  - `/bundles/:id`
- Admin Rentals/Bundles tabs were removed from active admin navigation.
- Book detail no longer fetches course recommendations.

#### Reason

- Bundles and rentals are roadmap later-phase features.
- Keeping them active would make the product look broader than the current MVP can safely support.
- Files remain in the repo for later phases, but they are intentionally not part of the active Phase 1 user flow.

### 2026-05-10 - Error Handling and Security-Related Frontend Changes

#### Error Handling

- Added improved error extraction for Axios/backend validation responses.
- Frontend can now display backend messages instead of only generic Axios errors.
- Checkout uses improved error extraction.
- Register uses improved error extraction.

#### Registration UX

- Registration password input now requires minimum length 8.
- This matches backend registration validation.
- Register page messaging keeps account creation optional because guest checkout remains supported.

#### Upload UX

- Admin image upload remains tied to backend upload hardening.
- Frontend accepts images through file inputs.
- Backend now enforces image-only uploads.

### 2026-05-10 - Kyrgyz UX Copy and Frontend Localization

#### Goal

- Localized user-facing frontend copy into professional, plain Kyrgyz.
- Treated this as a UX copy/localization pass only.
- Did not change:
  - business logic
  - API contracts
  - backend enum values
  - route definitions
  - checkout DTO shape
  - cart behavior
  - admin save/update behavior

#### Shared Label System

- Added shared Kyrgyz label helpers in `src/lib/labels.ts`.
- Centralized UI mappings for backend/API values:
  - order status labels
  - payment status labels
  - payment method labels
  - fulfillment type labels
  - book type labels
  - stock/availability labels
  - book copy status labels
  - book copy condition labels
  - rental status labels
  - known backend error labels
- Kept enum values unchanged in requests/responses while showing Kyrgyz labels in UI.

#### Public Customer Flow Localized

- Localized customer-facing routes:
  - home
  - catalog
  - book detail
  - cart
  - checkout
  - order success
  - login
  - register
  - profile
  - not-found page
- Replaced generic English ecommerce text with Kyrgyz bookstore copy:
  - `Books` -> `Китептер`
  - `Catalog` -> `Каталог`
  - `Cart` -> `Себет`
  - `Add to cart` -> `Себетке кошуу`
  - `Checkout` -> `Буйрутма берүү`
  - `Delivery` -> `Жеткирүү`
  - `Pickup` -> `Өзү алып кетүү`
  - `Order success` -> `Буйрутма кабыл алынды`
  - `Continue shopping` -> `Китеп тандоону улантуу`
- Localized customer error and empty states:
  - no books found
  - cart empty
  - order not available
  - checkout validation hints
  - loading states

#### Admin UI Localized

- Localized active admin surfaces:
  - admin dashboard
  - orders table
  - order detail drawer
  - books table
  - book form modal
  - categories tab
  - authors tab
  - Home CMS tab
  - settings tab
- Localized common admin operations:
  - `Save`
  - `Cancel`
  - `Delete`
  - `Edit`
  - `Create`
  - `Search`
  - `Actions`
  - `Status`
  - `Stock`
  - `Customer`
  - `Payment`
- Localized status displays while preserving API values:
  - new order
  - confirmed
  - fulfilling/preparing
  - ready for pickup
  - shipped/out for delivery
  - completed
  - cancelled
  - paid/unpaid/refunded

#### Future-Use Components Localized

- Localized retained but inactive/future-use UI components so English copy does not leak if they are reintroduced:
  - `ArticlesSection`
  - `FeaturedBookSection`
  - `Newsletter`
  - `PromoBanner`
  - `TopBar`
  - bundle public pages
  - bundle admin tab
  - rental admin tab
- Kept their deferred product status clear in Kyrgyz copy.
- Did not activate rental or bundle behavior.

#### Backend Error Display

- Updated frontend error handling to map known backend messages to Kyrgyz where possible.
- Added frontend fallback labels for known backend messages such as:
  - invalid credentials
  - duplicate email
  - delivery address required
  - order not found
  - book not found
  - insufficient stock
  - upload errors
- After backend localization, frontend can display the Kyrgyz backend response directly for newly localized errors.

#### Intentionally Kept in English

- Kept these user-facing or semi-user-facing terms where they are technical/common/product terms:
  - `EduBook`
  - `EduBot`
  - `EduPro`
  - `CRM`
  - `Admin`
  - `Email`
  - `WhatsApp`
  - `URL`
  - `ID`
  - `API`
  - `KGS`
  - `ISBN`
  - `AI`
  - `Telegram`
  - `Home CMS`
  - `Course ID`
- Kept code identifiers, variable names, function names, route paths, API fields, and enum values in English.

#### Copy Style Decisions

- Used short, practical Kyrgyz suitable for:
  - students
  - parents
  - teachers
  - bookstore operators
- Avoided overly formal/government-style wording.
- Used consistent terminology:
  - `Китептер`
  - `Себет`
  - `Буйрутма`
  - `Жеткирүү`
  - `Өзү алып кетүү`
  - `Кампада`
  - `Аз калды`
  - `Кампада жок`
  - `Жалпы сумма`
  - `Сактоо`
  - `Жокко чыгаруу`

#### Verification

- Ran `npm run build`.
- Frontend build passes after Kyrgyz localization.
- Current warning remains:
  - local Node is `20.17.0`
  - Vite recommends `20.19+` or `22.12+`

### 2026-05-10 - Follow-Up Kyrgyz UI Text Cleanup

#### Reason

- A stricter UI text scan found additional English still visible in rendered frontend surfaces.
- This follow-up pass focused on visible text that was missed because some strings looked technical or belonged to inactive/future-use components.

#### Additional UI Text Replaced

- Replaced visible admin wording:
  - `EduBook Admin` -> `EduBook башкаруу панели`
  - `Admin` navigation/profile copy -> `Башкаруу` / `башкаруучу`
  - `Admin эскертүүсү` -> `Ички эскертүү`
- Replaced visible technical CMS wording:
  - `Home CMS` -> `Башкы бет контенти`
  - `CMS маалыматы жок` -> `Башкы бет контенти жок`
  - `CMS сактоо` -> `Контентти сактоо`
  - `CTA тексти/шилтемеси` -> `Баскыч тексти/шилтемеси`
- Replaced visible future-phase wording:
  - `Phase 1` -> `биринчи этап`
  - `checkout` -> `буйрутма агымы`
  - `patch` -> `жаңыртуу`
  - `Frontend` placeholders/copy -> `Веб иштеп чыгуу`
- Replaced visible settings labels:
  - `Bot Token` -> `Бот токени`
  - `Public Channel ID` -> `Коомдук канал ID`
  - `Admin Chat ID` -> `Башкаруучу чат ID`
- Replaced category admin copy:
  - `Slug` -> `URL аталышы`
- Replaced accessibility/UI leftovers:
  - `avatar` alt text -> `Профиль сүрөтү`
  - Vite/React sample screen copy with neutral EduBook technical-check copy

#### Remaining English Intentionally Kept

- Brand/product and common technical terms remain where appropriate:
  - `EduBook`
  - `EduBot`
  - `EduPro`
  - `CRM`
  - `Email`
  - `WhatsApp`
  - `URL`
  - `ID`
  - `KGS`
  - `ISBN`
  - `Telegram`
- Route names, enum values, imports, type names, function names, and API fields remain in English because they are implementation contracts, not UI copy.

#### Verification

- Ran `npm run build`.
- Frontend build passes after the stricter UI text cleanup.
- Existing environment warning remains:
  - local Node is `20.17.0`
  - Vite recommends `20.19+` or `22.12+`

## Current Important Frontend Files

### App and Routing

- `src/app/routes.tsx`
  - Active route registration.
  - Active routes include customer bookstore routes, articles, bundles, and admin route.
- `src/main.tsx`
  - App bootstrap and providers.

### API and Types

- `src/lib/api.ts`
  - Central frontend API client.
  - Auth, books, catalog, orders, admin, homepage, uploads, rentals/bundles helper functions.
  - Some later-phase helper functions remain for admin/future workflows.
- `src/lib/types.ts`
  - Shared public domain types.
- `src/pages/admin/types/index.ts`
  - Admin-specific DTO shapes.
- `src/lib/errors.ts`
  - Shared backend/Axios error message extraction.

### Cart and Checkout

- `src/hooks/useCart.tsx`
  - Local cart state and `localStorage` persistence.
- `src/pages/CartPage.tsx`
  - Cart page.
- `src/pages/CheckoutPage.tsx`
  - Checkout form and order creation.
- `src/pages/OrderSuccessPage.tsx`
  - Public order confirmation view.

### Customer Catalog

- `src/pages/Home.tsx`
  - EduBook customer homepage.
- `src/pages/Catalog.tsx`
  - Real backend-backed catalog.
- `src/pages/BookPage.tsx`
  - Real backend-backed book detail page.
- `src/pages/ArticlePage.tsx`
  - Educational article detail page.
- `src/pages/BundlesPage.tsx`
  - Public bundle listing page.
- `src/pages/BundlePage.tsx`
  - Public bundle detail page.
- `src/components/BookCard.tsx`
  - Catalog book card.
- `src/components/SearchBar.tsx`
  - Search/filter UX.
- `src/components/Pagination.tsx`
  - Pagination UI.
- `src/components/EmptyState.tsx`
  - Shared empty state.

### Layout

- `src/components/layout/MainLayout.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/SEO.tsx`
  - Route metadata and structured data helper.
- `src/lib/business.ts`
  - Shared business contact, domain, address, and map configuration.

### Admin

- `src/pages/admin/AdminPage.tsx`
  - Active admin shell.
- `src/pages/admin/tabs/DashboardTab.tsx`
- `src/pages/admin/tabs/OrdersTab.tsx`
- `src/pages/admin/tabs/OrderDetailDrawer.tsx`
- `src/pages/admin/tabs/BooksTab.tsx`
- `src/pages/admin/tabs/BookFormModal.tsx`
- `src/pages/admin/tabs/CategoriesTab.tsx`
- `src/pages/admin/tabs/AuthorsTab.tsx`
- `src/pages/admin/tabs/HomeCMSTab.tsx`
- `src/pages/admin/tabs/SettingsTab.tsx`

### Styling

- `tailwind.config.js`
  - EduBot/EduBook visual tokens and dashboard utilities.
- `src/index.css`
  - Global styles and design polish.

## Verification History

Latest verified commands:

- `npm run lint`
  - Frontend lint passes.
- `npm run build`
  - Frontend build passes.
  - Current warnings are non-blocking stale browser data notices for `baseline-browser-mapping` and Browserslist/caniuse-lite.

## Known Frontend Risks and Remaining Work

### Before Launch

- Refresh stale browser data packages when convenient:
  - `baseline-browser-mapping`
  - Browserslist/caniuse-lite
- Add browser smoke tests for:
  - catalog load
  - book detail load
  - add to cart
  - cart quantity updates
  - checkout pickup
  - checkout delivery
  - order success lookup
  - admin order visibility
  - admin order status update
- Add cart stock refresh/clamping:
  - localStorage can become stale if stock changes in admin
  - backend rejects insufficient stock, but frontend should guide the user earlier
- Decide if Home CMS is launch-critical or should remain secondary.
- Improve admin confirmation flows beyond browser `confirm()` where needed.
- Add stronger loading/error handling on admin drawer/forms.

### Later Roadmap Phases

- Re-enable bundle pages only when bundle pricing and checkout behavior are defined.
- Re-enable rental admin/customer UI only after rental policy and backend runtime are ready.
- Add EduBot/EduPro/CRM UI only after backend integration contracts become active.
- Add AI recommendation UI only after catalog/order/rental data is stable and useful.
