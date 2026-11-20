# Keep — Privacy-First Personal Budgeting on Microsoft OneDrive

> **Team 6: FANTIX**  
> *A modern, privacy-first personal budgeting progressive web app that turns personal Microsoft OneDrive (Excel `.xlsx`) into an automated, localized database engine.*

---

## Key Pillars

- **Absolute Data Ownership**: Zero vendor lock-in. Your data lives in your own Microsoft OneDrive in raw Excel workbooks (`OneDrive/Apps/Keep/Budget_<YYYY>.xlsx`).
- **Zero Backend Maintenance**: Entirely client-side architecture communicating directly with Microsoft Graph via HTTPS.
- **Strict Privacy Isolation**: Sandboxed to `Files.ReadWrite.AppFolder`. Keep cannot read or modify any other folder on your OneDrive.
- **Zero localStorage Tokens**: Authentication tokens are kept strictly in browser memory via MSAL.js with Authorization Code Flow + PKCE.
- **Formula Injection Defense**: All user inputs are sanitized to strip dangerous formula characters (`=`, `+`, `-`, `@`) before writing to Excel.
- **Offline PWA Support**: Full offline caching and mutation queue powered by IndexedDB.

---

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Icons**: Lucide React
- **Auth**: `@azure/msal-browser` + `@azure/msal-react` (PKCE, in-memory tokens)
- **Data & Offline**: `idb` (IndexedDB promise wrapper)

---

## Team Structure

- **Omar Wahba** (@omarwahba) — *Technical Lead*: Project foundation, Entra app registration, MSAL authentication, Microsoft Graph & Excel engine, PWA setup, architecture, deployment.
- **Mazen** — *Technical (Frontend & UX)*: UI layout shell, 6 core screens (Dashboard, Transactions, Budgets, Savings, Insights, Settings), responsive design, animations.
- **Omar Mostafa** — *Technical (Data, Offline & Quality)*: IndexedDB cache, offline write queue, instant local search, formula injection sanitization, cache wipe, Excel verification.
- **Omar Fouad** — *Non-Technical*: Project documentation, report, presentation slides, user-testing materials, user copy review, demo video.

For contribution guidelines and branching rules, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v20+ (tested on v26+)
- npm v10+

### 2. Setup Environment
```bash
# Clone the repository
git clone <your-github-repo-url>
cd "Keep Budgetting App Project"

# Install project dependencies
npm install

# Configure environment variables
cp .env.example .env
```
Populate `.env` with your Microsoft Entra App Registration details (Client ID, Authority, Redirect URI).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
The output will be generated in `dist/`.
