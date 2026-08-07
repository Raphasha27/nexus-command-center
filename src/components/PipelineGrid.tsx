"use client";
import { useState } from "react";
import {
  Search,
  GitBranch,
  Clock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Loader2,
  CircleDashed,
  Minus,
  Workflow,
} from "lucide-react";
import { useReposData } from "@/lib/use-repos";
import type { PipelineRepo } from "@/lib/github";

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  failure: XCircle,
  running: Loader2,
  pending: CircleDashed,
  skipped: Minus,
};

const FILTERS = ["All", "success", "running", "failure", "pending"] as const;

export default function PipelineGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");
  const { data, loading } = useReposData();

  const repos: PipelineRepo[] = data?.repos ?? [];
  const counts = {
    All: repos.length,
    success: repos.filter((r) => r.status === "success").length,
    running: repos.filter((r) => r.status === "running").length,
    failure: repos.filter((r) => r.status === "failure").length,
    pending: repos.filter((r) => r.status === "pending").length,
  };

  const filtered = repos.filter((r) => {
    const matchFilter = filter === "All" || r.status === filter;
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.workflow.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading && repos.length === 0) {
    return (
      <div className="empty-state">
        <Loader2 size={36} className="spin-slow" style={{ margin: "0 auto 12px" }} />
        <p>Loading pipeline status…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <div className="filter-bar">
          {FILTERS.map((f) => {
            const Icon = f === "All" ? null : STATUS_ICONS[f];
            return (
              <button
                key={f}
                className={`filter-pill ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {Icon && <Icon size={12} className={f === "running" ? "spin-slow" : ""} />}
                <span className="cap">{f}</span>
                <strong className="pill-count">{counts[f]}</strong>
              </button>
            );
          })}
        </div>
        <div className="filter-search" style={{ marginLeft: "auto" }}>
          <Search size={13} />
          <input
            type="text"
            placeholder="Search repos or workflows…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Source note */}
      {data && (
        <div className="source-note">
          <span className={`source-dot ${data.source}`} />
          {data.source === "live" ? "Live data from GitHub Actions" : "Demo data (GitHub API unreachable)"}
        </div>
      )}

      {/* Grid */}
      <div className="pipeline-grid">
        {filtered.map((repo) => {
          const StatusIcon = STATUS_ICONS[repo.status] ?? CircleDashed;
          return (
            <div key={repo.name} className={`repo-card ${repo.status}`}>
              <div className="repo-card-header">
                <span className="repo-card-name">{repo.name}</span>
                <span className={`status-badge ${repo.status}`}>
                  <StatusIcon size={11} className={repo.status === "running" ? "spin-slow" : ""} />
                  {repo.status.charAt(0).toUpperCase() + repo.status.slice(1)}
                </span>
              </div>
              <div className="repo-card-workflow">
                <Workflow size={13} />
                {repo.workflow}
              </div>
              <div className="repo-card-footer">
                <span className="repo-card-time">
                  <Clock size={12} />
                  {repo.time}
                </span>
                <span className="repo-card-branch">
                  <GitBranch size={12} />
                  {repo.branch}
                </span>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-card-link"
                >
                  View <ExternalLink size={11} />
                </a>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1/-1" }}>
            <Search size={36} style={{ margin: "0 auto 10px" }} />
            <p>No repositories match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}