"use client";
import { useState, useEffect } from "react";
import { FolderGit2, GitBranch, CheckCircle2, Clock, ExternalLink, ChevronLeft, ChevronRight, Lock, Globe } from "lucide-react";

const PAGE_SIZE = 20;

// Static repo list – replace with real API call when GitHub token is available
const ALL_REPOS = [
  { name: "securebank-360",               lang: "TypeScript", stars: 12, visibility: "private", status: "success", updated: "2h ago" },
  { name: "thuto-ai",                     lang: "Python",     stars: 8,  visibility: "public",  status: "success", updated: "5h ago" },
  { name: "noshowiq-fullstack",           lang: "TypeScript", stars: 6,  visibility: "private", status: "success", updated: "8h ago" },
  { name: "enterprise-fastapi-starter",   lang: "Python",     stars: 22, visibility: "public",  status: "success", updated: "1d ago" },
  { name: "finaxis-app",                  lang: "TypeScript", stars: 5,  visibility: "private", status: "success", updated: "1d ago" },
  { name: "pharmalink",                   lang: "JavaScript", stars: 4,  visibility: "public",  status: "success", updated: "1d ago" },
  { name: "Nexus-Quant",                  lang: "Python",     stars: 31, visibility: "public",  status: "success", updated: "2d ago" },
  { name: "Mzansi-AgriAI",               lang: "Python",     stars: 9,  visibility: "public",  status: "success", updated: "2d ago" },
  { name: "DDOS-Detection-Simulator",    lang: "Python",     stars: 14, visibility: "public",  status: "success", updated: "2d ago" },
  { name: "Password-Analyzer",           lang: "Python",     stars: 7,  visibility: "public",  status: "success", updated: "2d ago" },
  { name: "cybershield_soc",             lang: "TypeScript", stars: 18, visibility: "private", status: "success", updated: "3d ago" },
  { name: "saas-multitenant-backend",    lang: "Python",     stars: 10, visibility: "private", status: "success", updated: "3d ago" },
  { name: "Sumbandila-App",              lang: "TypeScript", stars: 6,  visibility: "public",  status: "success", updated: "3d ago" },
  { name: "ticketza",                    lang: "TypeScript", stars: 5,  visibility: "private", status: "success", updated: "3d ago" },
  { name: "raphasha-dev-portfolio",      lang: "TypeScript", stars: 3,  visibility: "public",  status: "success", updated: "4d ago" },
  { name: "Sovereign-AI-Nexus-v2",       lang: "Python",     stars: 20, visibility: "private", status: "success", updated: "4d ago" },
  { name: "devforge-ai",                 lang: "Python",     stars: 11, visibility: "public",  status: "success", updated: "4d ago" },
  { name: "repo-audit-bot",              lang: "Python",     stars: 8,  visibility: "public",  status: "success", updated: "5d ago" },
  { name: "Insider-Threat-Detector",     lang: "Python",     stars: 13, visibility: "public",  status: "success", updated: "5d ago" },
  { name: "kirov-algorithms",            lang: "Go",         stars: 5,  visibility: "public",  status: "running", updated: "5d ago" },
  { name: "CyberMesh-Labs",              lang: "Python",     stars: 9,  visibility: "public",  status: "success", updated: "1w ago" },
  { name: "Password-Hasher",             lang: "Python",     stars: 4,  visibility: "public",  status: "success", updated: "1w ago" },
  { name: "PhantomGrid-OSINT-Lab",       lang: "Python",     stars: 16, visibility: "public",  status: "success", updated: "1w ago" },
  { name: "Phishing-Awareness-Game",     lang: "JavaScript", stars: 7,  visibility: "public",  status: "success", updated: "1w ago" },
  { name: "secure-auth-rbac-template",   lang: "Python",     stars: 19, visibility: "public",  status: "success", updated: "1w ago" },
  { name: "autonomous-dev-factory-v7",   lang: "Python",     stars: 24, visibility: "private", status: "success", updated: "1w ago" },
  { name: "autonomous-dev-factory-core", lang: "Python",     stars: 21, visibility: "private", status: "success", updated: "1w ago" },
  { name: "za-local-ai-toolkit",         lang: "Python",     stars: 12, visibility: "public",  status: "success", updated: "2w ago" },
  { name: "smart-packaging-platform",    lang: "TypeScript", stars: 6,  visibility: "private", status: "success", updated: "2w ago" },
  { name: "sec-audit-cli",               lang: "Python",     stars: 8,  visibility: "public",  status: "success", updated: "2w ago" },
  { name: "api-mock-server",             lang: "TypeScript", stars: 4,  visibility: "public",  status: "success", updated: "2w ago" },
  { name: "Management-System",           lang: "JavaScript", stars: 3,  visibility: "private", status: "success", updated: "2w ago" },
  { name: "docker-deployment-templates", lang: "Shell",      stars: 15, visibility: "public",  status: "success", updated: "2w ago" },
  { name: "SupplyWaveSA",               lang: "TypeScript", stars: 7,  visibility: "private", status: "success", updated: "3w ago" },
  { name: "GitFlowPro",                 lang: "TypeScript", stars: 5,  visibility: "public",  status: "success", updated: "3w ago" },
  { name: "ironclad-sandbox",           lang: "Python",     stars: 9,  visibility: "private", status: "success", updated: "3w ago" },
  { name: "saas-multitenant-backend",   lang: "Python",     stars: 10, visibility: "private", status: "success", updated: "3w ago" },
  { name: "repo-autopilot-enterprise",  lang: "Python",     stars: 17, visibility: "private", status: "success", updated: "1m ago" },
  { name: "Raphasha27-contribution-snake",lang:"TypeScript", stars: 11, visibility: "public",  status: "success", updated: "1m ago" },
  { name: "Predictive-Core-Lab",        lang: "Python",     stars: 20, visibility: "public",  status: "success", updated: "1m ago" },
  { name: "devforge-ai",                lang: "Python",     stars: 11, visibility: "public",  status: "success", updated: "1m ago" },
  { name: "Sumbandila-App",             lang: "TypeScript", stars: 6,  visibility: "public",  status: "success", updated: "1m ago" },
  { name: "cybershield_soc",            lang: "TypeScript", stars: 18, visibility: "private", status: "success", updated: "1m ago" },
  { name: "ticketza",                   lang: "TypeScript", stars: 5,  visibility: "private", status: "success", updated: "1m ago" },
  { name: "PhantomGrid-OSINT-Lab",      lang: "Python",     stars: 16, visibility: "public",  status: "success", updated: "1m ago" },
  { name: "Nexus-Quant",               lang: "Python",     stars: 31, visibility: "public",  status: "success", updated: "2m ago" },
  { name: "Sovereign-AI-Nexus-v2",     lang: "Python",     stars: 20, visibility: "private", status: "success", updated: "2m ago" },
  { name: "autonomous-dev-factory-v7", lang: "Python",     stars: 24, visibility: "private", status: "success", updated: "2m ago" },
  { name: "enterprise-fastapi-starter",lang: "Python",     stars: 22, visibility: "public",  status: "success", updated: "2m ago" },
  { name: "saas-multitenant-backend",  lang: "Python",     stars: 10, visibility: "private", status: "success", updated: "2m ago" },
  { name: "finaxis-app",               lang: "TypeScript", stars: 5,  visibility: "private", status: "success", updated: "2m ago" },
  { name: "noshowiq-fullstack",        lang: "TypeScript", stars: 6,  visibility: "private", status: "success", updated: "2m ago" },
];

const LANG_COLORS: Record<string, string> = {
  TypeScript: "var(--blue)",
  Python:     "var(--amber)",
  JavaScript: "var(--amber)",
  Go:         "var(--cyan)",
  Shell:      "var(--green)",
  Rust:       "var(--red)",
};

export default function RepositoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = ALL_REPOS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Repositories</div>
          <div className="topbar-sub">
            <strong>{total}</strong> repositories · All monitored &amp; secured
          </div>
        </div>
        <div className="topbar-right">
          <a href="https://github.com/Raphasha27?tab=repositories" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink size={14} />
            View on GitHub
          </a>
        </div>
      </header>

      <div className="page">
        {/* Search */}
        <div className="filter-search" style={{ maxWidth: 340 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14, color: "var(--text-muted)" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Filter repositories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="repo-table-wrap">
          <table className="repo-table">
            <thead>
              <tr>
                <th>Repository</th>
                <th>Language</th>
                <th>Visibility</th>
                <th>CI Status</th>
                <th>Stars</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((repo, i) => (
                <tr key={`${repo.name}-${i}`}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <FolderGit2 size={15} style={{ color: "var(--cyan)", flexShrink: 0 }} />
                      <span className="text-primary mono">{repo.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: LANG_COLORS[repo.lang] ?? "var(--text-muted)", flexShrink: 0 }} />
                      <span style={{ fontSize: 12 }}>{repo.lang}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`tag ${repo.visibility}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {repo.visibility === "private" ? <Lock size={10} /> : <Globe size={10} />}
                      {repo.visibility}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {repo.status === "success"
                        ? <CheckCircle2 size={13} style={{ color: "var(--green)" }} />
                        : <Clock size={13} style={{ color: "var(--amber)" }} />
                      }
                      <span style={{ fontSize: 12, color: repo.status === "success" ? "var(--green)" : "var(--amber)", fontWeight: 600 }}>
                        {repo.status === "success" ? "Passing" : "Running"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="mono" style={{ color: "var(--amber)", fontSize: 12 }}>★ {repo.stars}</span>
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: 11 }}>{repo.updated}</span>
                  </td>
                  <td>
                    <a
                      href={`https://github.com/Raphasha27/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                    >
                      <ExternalLink size={12} />
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={13} /> Prev
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
            <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>
              {n}
            </button>
          ))}

          <span className="page-info">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>

          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </>
  );
}
