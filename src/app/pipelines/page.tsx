"use client";
import PipelineGrid from "@/components/PipelineGrid";
import { GitBranch, ExternalLink } from "lucide-react";

export default function PipelinesPage() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">CI/CD Pipelines</div>
          <div className="topbar-sub">Live workflow run status across all monitored repositories</div>
        </div>
        <div className="topbar-right">
          <a href="https://github.com/Raphasha27" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink size={14} />
            GitHub Actions
          </a>
        </div>
      </header>
      <div className="page">
        <div className="section-hd">
          <div className="section-title">
            <div className="st-dot" style={{ background: "var(--cyan)", boxShadow: "0 0 7px var(--cyan)" }} />
            All Pipeline Runs
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
            <div className="spinner" />
            Syncing with GitHub Actions…
          </div>
        </div>
        <PipelineGrid />
      </div>
    </>
  );
}
