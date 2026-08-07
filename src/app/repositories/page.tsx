"use client";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Clock,
  ExternalLink,
  FolderGit2,
  CheckCircle2,
  XCircle,
  Loader2,
  Minus,
  CircleDashed,
  Lock,
} from "lucide-react";
import type { PipelineRepo, OrgStats } from "@/lib/github";

const PAGE_SIZE = 10;

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  failure: XCircle,
  running: Loader2,
  pending: CircleDashed,
  skipped: Minus,
};

const STATUS_FILTERS = ["All", "success", "running", "failure", "pending", "skipped"] as const;

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<PipelineRepo[]>([]);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/repos")
      .then((r) => r.json())
      .then((data) => {
        setRepos(data.repos ?? []);
        setStats(data.stats ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const languages = ["All", ...new Set(repos.map((r) => r.language).filter(Boolean))];

  const filtered = repos.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.workflow.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    const matchLang = languageFilter === "All" || r.language === languageFilter;
    return matchSearch && matchStatus && matchLang;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleStatus = (value: string) => {
    setStatusFilter(value as never);
    setPage(1);
  };
  const handleLanguage = (value: string) => {
    setLanguageFilter(value);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <Loader2 size={40} className="spin-slow" style={{ margin: "0 auto 12px" }} />
          <p>Loading repositories from GitHub…</p>
        </div>
      </div>
    );
  }

  if (error || repos.length === 0) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <FolderGit2 size={40} style={{ margin: "0 auto 12px" }} />
          <p>No repositories available right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <header className="topbar" style={{ position: "static", margin: "-32px -32px 0" }}>
        <div className="topbar-title">
          <h1>Repositories</h1>
          <p>
            {stats ? `${stats.total.toLocaleString()} repositories · ${stats.source === "live" ? "Live GitHub data" : "Demo data"}` : "GitHub repositories"}
          </p>
        </div>
        <div className="topbar-actions">
          <div className="live-indicator">
            <span className="refresh-dot" />
            Synced {stats ? new Date(stats.fetchedAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) : ""}
          </div>
        </div>
      </header>

      {/* Status summary */}
      <div className="repos-summary">
        {STATUS_FILTERS.filter((s) => s !== "All").map((s) => {
          const Icon = STATUS_ICONS[s];
          const count = repos.filter((r) => r.status === s).length;
          return (
            <button
              key={s}
              className={`repo-summary-pill ${statusFilter === s ? "active" : ""} ${s}`}
              onClick={() => setStatusFilter(s)}
            >
              <Icon size={14} className={s === "running" ? "spin-slow" : ""} />
              <span className="cap">{s}</span>
              <strong>{count}</strong>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="table-toolbar">
        <div className="filter-bar">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => handleStatus(e.target.value)}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={languageFilter}
            onChange={(e) => handleLanguage(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All languages" : l}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-search">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search repositories…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="repo-table-wrap panel">
        <table className="repo-table">
          <thead>
            <tr>
              <th>Repository</th>
              <th>Status</th>
              <th>Workflow</th>
              <th>Branch</th>
              <th>Language</th>
              <th>Last run</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((repo) => {
              const StatusIcon = STATUS_ICONS[repo.status] ?? CircleDashed;
              return (
                <tr key={repo.name}>
                  <td>
                    <div className="repo-cell">
                      <div className="repo-cell-icon">
                        <FolderGit2 size={15} />
                      </div>
                      <div>
                        <div className="repo-cell-name">
                          {repo.name}
                          {repo.visibility === "private" && <Lock size={11} className="ml-1" />}
                        </div>
                        <div className="repo-cell-desc">{repo.description || "—"}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${repo.status}`}>
                      <StatusIcon size={12} className={repo.status === "running" ? "spin-slow" : ""} />
                      {repo.status.charAt(0).toUpperCase() + repo.status.slice(1)}
                    </span>
                  </td>
                  <td className="cell-muted">{repo.workflow}</td>
                  <td>
                    <span className="branch-pill">
                      <GitBranch size={12} />
                      {repo.branch}
                    </span>
                  </td>
                  <td>
                    <span className="lang-pill">{repo.language || "—"}</span>
                  </td>
                  <td className="cell-muted">
                    <span className="time-pill">
                      <Clock size={12} />
                      {repo.time}
                    </span>
                  </td>
                  <td>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-link-icon"
                      title="Open on GitHub"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <Search size={36} style={{ margin: "0 auto 10px" }} />
                    <p>No repositories match your filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="pagination-controls">
            <button
              className="btn btn-ghost"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <span className="pagination-page">
              {safePage} / {totalPages}
            </span>
            <button
              className="btn btn-ghost"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}