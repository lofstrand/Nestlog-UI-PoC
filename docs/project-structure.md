# Recommended Folder Structure — React (2025)

This document summarizes a scalable folder structure for modern React apps, based on the referenced article.

---

## Goals

A good structure helps with:

- Maintainability
- Scalability
- Separation of concerns
- Team collaboration

---

## Root layout

Recommended high-level layout:

    /my-app
    ├── /public/
    ├── /src/
    ├── .gitignore
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ├── vite.config.(js|ts)
    ├── eslint.config.(js|ts) OR .eslintrc.*
    └── (other tooling configs...)

---

## Public vs Source

### `/public`

Static files served directly by the web server (not imported through the bundler).

Example:

    /public
    ├── index.html
    ├── favicon.ico
    └── /images/

### `/src`

All application code.

Recommended structure:

    /src
    ├── /assets/
    ├── /components/
    ├── /features/
    ├── /hooks/
    ├── /layouts/
    ├── /pages/
    ├── /services/
    ├── /store/
    ├── /styles/
    ├── /types/
    ├── /utils/
    ├── /config/
    ├── app.tsx
    ├── index.tsx
    └── router.tsx

---

## Folder responsibilities

### `/src/assets`

App-bundled static assets used by code (images, fonts, media).

Keep `public/` for “served as-is” assets, and `src/assets/` for assets you import.

### `/src/components`

Reusable UI components shared across multiple parts of the app.

Guideline:

- Keep these “feature-agnostic” (no domain rules embedded).

### `/src/features`

Feature/domain modules. Each feature owns its UI, state, and logic.

Example:

    /src/features
    ├── /auth/
    │   ├── /components/
    │   ├── /hooks/
    │   ├── /services/
    │   ├── /types/
    │   └── index.ts
    └── /dashboard/
        ├── /components/
        ├── /hooks/
        ├── /services/
        ├── /types/
        └── index.ts

Guideline:

- Prefer feature encapsulation over dumping everything into global folders.

### `/src/hooks`

Custom hooks used across features/pages.

Guideline:

- If a hook is feature-specific, keep it inside that feature folder instead.

### `/src/layouts`

Layout components such as shell layouts, navigation scaffolding, shared headers/footers.

### `/src/pages`

Route-level components (screens). These should be relatively thin and compose features/components.

Guideline:

- Pages orchestrate; features implement.

### `/src/services`

API clients and integration logic (HTTP, WebSocket, external SDK wrappers).

Guideline:

- Consider splitting into:
  - global services (shared)
  - feature services (inside `/features/<x>/services`)

### `/src/store`

Global state management (Redux/Zustand/context setup).

Guideline:

- Keep feature slices close to features when possible, and only centralize wiring here.

### `/src/styles`

Global styles, theme tokens, SASS setup, and shared mixins.

Suggested pattern:

    /src/styles
    ├── _tokens.scss
    ├── _mixins.scss
    ├── globals.scss
    └── theme.scss

### `/src/types`

Shared TypeScript types/interfaces used across the app.

Guideline:

- Prefer feature-local types inside `/features/<x>/types` when possible.

### `/src/utils`

Pure helper functions and small utilities.

Guideline:

- Keep utilities focused and stateless.
- Avoid hiding business rules here; business logic belongs in features/services.

### `/src/config`

Configuration and environment mapping (runtime config, constants, feature flags).

---

## Entry files

Typical responsibilities:

- `index.tsx`: app bootstrap and render root
- `app.tsx`: root component composition (providers, layout, app shell)
- `router.tsx`: routing setup (route definitions, guards, lazy loading)

---

## Scaling guidelines

- Start simple: use only the folders you need.
- As features grow, move feature-specific pieces into `/features/<feature>/...`.
- Prefer co-location: keep things that change together near each other.
- Avoid “mega-folders” (e.g., one huge `components/`); split by feature when it starts to sprawl.

---

## Optional conventions (recommended)

### Barrel exports

Use `index.ts` files sparingly to simplify imports, especially at the feature boundary.

Example:

    /src/features/auth/index.ts

Exports:

- public components/hooks/types for the auth feature

### Test co-location

Keep tests next to the code they verify.

Example:

    /src/features/auth/services/login.test.ts
    /src/components/Button/Button.test.tsx

---
