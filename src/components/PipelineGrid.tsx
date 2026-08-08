"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Loader2, Clock, GitBranch, ExternalLink, Search, Filter } from "lucide-react";

const REPOS = [
  { name: "securebank-360",          workflow: "CI / Security Analysis",    status: "success", time: "2m ago",  url: "https://github.com/Raphasha27/securebank-360/actions" },
  { name: "thuto-ai",                workflow: "CI · Build & Test",          status: "success", time: "5m ago",  url: "https://github.com/Raphasha27/thuto-ai/actions" },
  { name: "noshowiq-fullstack",      workflow: "CI - Lint, Typecheck & Test",status: "success", time: "8m ago",  url: "https://github.com/Raphasha27/noshowiq-fullstack/actions" },
  { name: "enterprise-fastapi",      workflow: "CI Pipeline",                status: "success", time: "10m ago", url: "https://github.com/Raphasha27/enterprise-fastapi-starter/actions" },
  { name: "finaxis-app",             workflow: "CI / Build",                 status: "success", time: "12m ago", url: "https://github.com/Raphasha27/finaxis-app/actions" },
  { name: "pharmalink",              workflow: "Node.js CI",                 status: "success", time: "15m ago", url: "https://github.com/Raphasha27/pharmalink/actions" },
  { name: "Nexus-Quant",             workflow: "CI · Tests & Coverage",      status: "success", time: "18m ago", url: "https://github.com/Raphasha27/Nexus-Quant/actions" },
  { name: "Mzansi-AgriAI",           workflow: "CI Pipeline",                status: "success", time: "20m ago", url: "https://github.com/Raphasha27/Mzansi-AgriAI/actions" },
  { name: "DDOS-Detection-Sim",      workflow: "CI",                         status: "success", time: "22m ago", url: "https://github.com/Raphasha27/DDOS-Detection-Simulator/actions" },
  { name: "Password-Analyzer",       workflow: "CI",                         status: "success", time: "24m ago", url: "https://github.com/Raphasha27/Password-Analyzer/actions" },
  { name: "cybershield_soc",         workflow: "CI · Build & Deploy",        status: "success", time: "26m ago", url: "https://github.com/Raphasha27/cybershield_soc/actions" },
  { name: "saas-multitenant",        workflow: "CI Pipeline",                status: "success", time: "28m ago", url: "https://github.com/Raphasha27/saas-multitenant-backend/actions" },
  { name: "Sumbandila-App",          workflow: "CI - Lint & Test",           status: "success", time: "30m ago", url: "https://github.com/Raphasha27/Sumbandila-App/actions" },
  { name: "ticketza",                workflow: "CI / Deploy",                status: "success", time: "32m ago", url: "https://github.com/Raphasha27/ticketza/actions" },
  { name: "raphasha-dev-portfolio",  workflow: "CI Pipeline",                status: "success", time: "34m ago", url: "https://github.com/Raphasha27/raphasha-dev-portfolio/actions" },
  { name: "Sovereign-AI-Nexus-v2",   workflow: "CI · Full Stack",            status: "success", time: "36m ago", url: "https://github.com/Raphasha27/Sovereign-AI-Nexus-v2/actions" },
  { name: "devforge-ai",             workflow: "CI Build",                   status: "success", time: "38m ago", url: "https://github.com/Raphasha27/devforge-ai/actions" },
  { name: "repo-audit-bot",          workflow: "CI Pipeline",                status: "success", time: "40m ago", url: "https://github.com/Raphasha27/repo-audit-bot/actions" },
  { name: "Insider-Threat-Det.",     workflow: "CI · Security",              status: "success", time: "42m ago", url: "https://github.com/Raphasha27/Insider-Threat-Detector/actions" },
  { name: "kirov-algorithms",        workflow: "CI Tests",                   status: "running", time: "now",     url: "https://github.com/Kirov-Dynamics-Technology/kirov-algorithms/actions" },
  { name: "CyberMesh-Labs",          workflow: "Security Scan",              status: "success", time: "1h ago",  url: "https://github.com/Raphasha27/CyberMesh-Labs/actions" },
  { name: "Password-Hasher",         workflow: "CI",                         status: "success", time: "1h ago",  url: "https://github.com/Raphasha27/Password-Hasher/actions" },
  { name: "PhantomGrid-OSINT-Lab",   workflow: "CI · OSINT Tools",           status: "success", time: "1h ago",  url: "https://github.com/Raphasha27/PhantomGrid-OSINT-Lab/actions" },
  { name: "Phishing-Awareness-Game", workflow: "CI Build",                   status: "success", time: "1h ago",  url: "https://github.com/Raphasha27/Phishing-Awareness-Game/actions" },
];

const FILTERS = [
  { label: "All",     value: "all" },
  { label: "Passing", value: "success" },
  { label: "Running", value: "running" },
  { label: "Failed",  value: "failure" },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "success") return <CheckCircle2 size={11} />;
  if (status === "failure") return <XCircle size={11} />;
  if (status === "running") return <Loader2 size={11} className="spin-icon" />;
  return <Clock size={11} />;
};

export default function PipelineGrid() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const counts = {
    success: REPOS.filter(r => r.status === "success").length,
    running: REPOS.filter(r => r.status === "running").length,
    failure: REPOS.filter(r => r.status === "failure").length,
  };

  const filtered = REPOS.filter(r => {
    const matchFilter = filter === "all" || r.status === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div>
      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.value}
            className={`filter-pill ${filter === f.value ? "active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            <Filter size={12} />
            {f.label}
            {f.value === "all" && <span style={{ fontFamily: "var(--mono)", fontSize: 10 }}>({REPOS.length})</span>}
            {f.value === "success" && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--green)" }}>{counts.success}</span>}
            {f.value === "running" && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--amber)" }}>{counts.running}</span>}
            {f.value === "failure" && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)" }}>{counts.failure}</span>}
          </button>
        ))}
        <div className="filter-search">
          <Search size={13} />
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="pipeline-grid">
        {filtered.map(repo => (
          <div key={repo.name} className={`repo-card ${repo.status}`}>
            <div className="repo-card-top">
              <span className="repo-name">{repo.name}</span>
              <span className={`status-chip ${repo.status}`}>
                <StatusIcon status={repo.status} />
                {repo.status === "success" ? "Passing" : repo.status === "failure" ? "Failed" : "Running"}
              </span>
            </div>
            <div className="repo-workflow">
              <GitBranch size={12} />
              {repo.workflow}
            </div>
            <div className="repo-footer">
              <span className="repo-time">
                <Clock size={11} />
                {repo.time}
              </span>
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="repo-link">
                View Run
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <Search />
            <p>No repositories match your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
