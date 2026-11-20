# Team Collaboration & Contribution Guide
**Project:** Keep (Team 6: FANTIX)  
**Concept:** Privacy-first personal budgeting app on Microsoft OneDrive (Excel Engine)

---

## 1. Team Structure & Ownership

| Member | Role | Codebase Ownership | Key Responsibilities |
| :--- | :--- | :--- | :--- |
| **Omar Wahba** | **Technical Lead** (Auth & Excel Integration) | `src/auth/`<br>`src/services/graph/`<br>`src/contracts/` | Project foundation, Entra app registration, MSAL authentication, Microsoft Graph & Excel engine, PWA setup, architecture decisions, code reviews & PR merges, deployment. |
| **Mazen** | **Technical** (Frontend & UX) | `src/components/`<br>`src/pages/` | Build user interface: desktop sidebar & header, mobile navigation, 6 main screens (Dashboard, Transactions, Budgets, Savings, Insights, Settings), modals, loading/empty/error states, Tailwind CSS & Framer Motion animations. |
| **Omar Mostafa** | **Technical** (Data, Offline & Quality) | `src/data/`<br>`src/utils/` | Build data layer: IndexedDB cache & offline queue, automatic sync upon reconnect, instant local search across cached months, formula & CSV injection sanitization, sign-out cache wipe, Excel verification. |
| **Omar Fouad** | **Non-technical** | `docs/` | Final project report, presentation slides, user-testing materials, reviewing all user-facing text (labels, empty states, error messages) for clarity, recording demo video & screenshots. |

---

## 2. Architecture & Module Contracts

To prevent merge conflicts and blockers, each module is decoupled behind clear interface contracts located in `src/contracts/`:

```
┌────────────────────────────────────────────────────────┐
│                   User Interface (Mazen)               │
│               src/components/ & src/pages/             │
└──────────────────────────┬─────────────────────────────┘
                           │ (Calls IDataLayer methods)
┌──────────────────────────▼─────────────────────────────┐
│                 Data Layer (Omar Mostafa)              │
│            IndexedDB Cache, Offline Queue, Search      │
│                      src/data/                         │
└──────────────────────────┬─────────────────────────────┘
                           │ (Calls IGraphService methods)
┌──────────────────────────▼─────────────────────────────┐
│                Graph Service (Omar Wahba)              │
│       Excel Engine: OneDrive/Apps/Keep/Budget_YYYY     │
│                 src/services/graph/                    │
└──────────────────────────┬─────────────────────────────┘
                           │ (Requests Access Token)
┌──────────────────────────▼─────────────────────────────┐
│                 Auth Module (Omar Wahba)               │
│          MSAL.js • PKCE • In-Memory Tokens Only        │
│                      src/auth/                         │
└────────────────────────────────────────────────────────┘
```

### Figma Design Specs Reference
- All official screen mockups designed in Figma for both desktop and mobile viewports are organized in:
  - `docs/designs/desktop/` (01-signin to 40-signout-confirmation)
  - `docs/designs/mobile/` (01-signin to 41-menu-drawer)
- **Mazen** references these screens when building the layout shell, the 6 core pages, overlays, and empty/loading/error states.

---

## 3. Git Workflow & Branching Strategy

To keep the repository clean and avoid collisions:

### Branch Naming Conventions
- Omar Wahba: `feature/auth-<description>` or `feature/graph-<description>`
- Mazen: `feature/ui-<screen-or-component>` (e.g. `feature/ui-dashboard`, `feature/ui-transactions`)
- Omar Mostafa: `feature/data-<feature>` (e.g. `feature/data-indexeddb`, `feature/data-sanitization`)
- Omar Fouad: `docs/<topic>` (e.g. `docs/project-report`)

### Rules of Engagement
1. **Never commit directly to `main`**: Always create a feature branch from the latest `main`.
2. **Pull frequently**: Run `git pull origin main` before starting new work.
3. **Pull Requests**: Open a PR against `main` when your feature is complete and tested.
4. **Code Reviews**: Omar Wahba leads integration checkpoints and merges PRs into `main`.

---

## 4. Security & Coding Rules (Mandatory)

1. **Zero localStorage Tokens**: Never store MSAL tokens in `localStorage` or `sessionStorage`. All tokens must live strictly in memory (`cacheLocation: 'memoryStorage'`).
2. **Formula Injection Sanitization**: All user text inputs (descriptions, notes, categories) must pass through `sanitizeInput()` in `src/data/sanitization.js` to strip leading `=`, `+`, `-`, and `@` before being saved to Excel.
3. **Date Formats**: All transaction dates written to Excel must be strictly Date-only (`YYYY-MM-DD`). No timestamps.
4. **AppFolder Sandbox**: Always use scope `Files.ReadWrite.AppFolder`. Keep never accesses files outside `OneDrive/Apps/Keep`.
5. **Secrets**: Never commit `.env` or `.env.local` files to Git. Always copy from `.env.example`.

---

## 5. Development Scripts

```bash
# Install dependencies
npm install

# Start local development server (runs on http://localhost:5173)
npm run dev

# Run Oxlint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```
