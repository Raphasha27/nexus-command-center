# Nexus Command Center

Organization-wide DevOps dashboard for **Raphasha27** — real-time GitHub repository monitoring, CI/CD pipeline tracking, security analytics, and one-click DevOps automation.

![Stack](https://img.shields.io/badge/Next.js%2016-111827?logo=nextdotjs&logoColor=white)
![Runtime](https://img.shields.io/badge/React-19-0ea5e9)
![Charts](https://img.shields.io/badge/Recharts-3-22d3ee)

## ✨ Features

- **Live Dashboard** — organizational metrics pulled straight from the GitHub API (repositories, workflow-run statuses, pass rate). Falls back to a realistic offline demo dataset when the API/token is unavailable.
- **Repositories** — searchable, paginated table of all org repositories with status, branch, language, workflow, and last-run time. Filter by status and language.
- **Analytics** — 30-day CI success trend, runs-per-day, status distribution, and language breakdown with interactive charts (Recharts).
- **Pipeline Grid** — color-coded CI/CD cards with live status, search, and filters.
- **Security Hub** — animated A+ score ring, coverage bars, and a full security configuration checklist.
- **Auto-Pilot** — one-click DevOps automation actions with running/complete state.
- **Activity Feed** — color-coded log of recent automation work.
- Polished, professional UI built with **lucide-react** icons and a dark "command center" aesthetic.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

Create `.env.local` (already git-ignored):

```env
GITHUB_TOKEN=your_github_token   # optional — enables live GitHub API data
GITHUB_OWNER=Raphasha27          # optional — defaults to Raphasha27
```

Without a token, the dashboard runs in **demo mode** with a generated dataset (198 repos) so every screen is fully functional.

## 🧪 Quality

```bash
npm run lint   # ESLint
npm run build  # TypeScript + production build
```

## 📁 Structure

```
src/
├── components/   # UI: Sidebar, PipelineGrid, SecurityHub, AutopilotPanel, ActivityFeed
├── lib/          # github.ts (API client + demo fallback), analytics.ts (metrics), use-repos.ts (hook)
└── app/
    ├── api/      # /api/repos, /api/analytics route handlers
    ├── page.tsx        # Dashboard
    ├── repositories/   # Paginated repository table
    └── analytics/      # Charts
```

## 📄 License

Private — © Raphasha27