"use client";
import { useState, useEffect } from "react";
import { Package, CheckCircle2, AlertTriangle, GitMerge, TrendingUp, GitBranch, ExternalLink, Rocket, BarChart2 } from "lucide-react";
import PipelineGrid from "@/components/PipelineGrid";
import SecurityHub from "@/components/SecurityHub";
import AutopilotPanel from "@/components/AutopilotPanel";
import ActivityFeed from "@/components/ActivityFeed";

const stats = [
  { label: "Total Repositories", value: "198", accent: "cyan",   icon: Package,        change: "+12 this month" },
  { label: "CI/CD Passing",      value: "96%", accent: "green",  icon: CheckCircle2,   change: "+34% from baseline" },
  { label: "Open Alerts",        value: "4",   accent: "red",    icon: AlertTriangle,  change: "−53 resolved today" },
  { label: "PRs Merged",         value: "57",  accent: "purple", icon: GitMerge,       change: "since last session" },
];

const TABS = [
  { id: "pipelines", label: "CI/CD Pipelines", icon: GitBranch },
  { id: "autopilot", label: "Auto-Pilot",       icon: Rocket },
];

export default function HomePage() {
  const [tab, setTab] = useState<"pipelines" | "autopilot">("pipelines");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Command Center</div>
          <div className="topbar-sub">
            Organization: <strong>Raphasha27</strong> · 198 repositories monitored
          </div>
        </div>
        <div className="topbar-right">
          <div className="live-indicator">
            <div className="pulse-dot" />
            {clock}
          </div>
          <a href="https://github.com/Raphasha27" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink size={14} />
            GitHub
          </a>
          <button className="btn btn-primary">
            <Rocket size={14} />
            Deploy
          </button>
        </div>
      </header>

      <div className="page">
        {/* Stats row */}
        <div className="stats-row">
          {stats.map(({ label, value, accent, icon: Icon, change }) => (
            <div key={label} className="stat-card" data-accent={accent}>
              <div className="sc-header">
                <span className="sc-label">{label}</span>
                <div className="sc-icon"><Icon size={18} strokeWidth={1.8} /></div>
              </div>
              <div className="sc-value">{value}</div>
              <div className="sc-footer">
                <span className="sc-change">
                  <TrendingUp size={11} />
                  {change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Hero banner */}
        <div className="glow-banner">
          <div>
            <div className="glow-banner-title">
              <CheckCircle2 size={20} style={{ color: "var(--green)" }} />
              Organization-wide CI/CD Modernization Complete
            </div>
            <div className="glow-banner-sub">
              All 52 primary repositories upgraded to{" "}
              <strong style={{ color: "var(--cyan)" }}>GitHub Actions v4</strong> and{" "}
              <strong style={{ color: "var(--cyan)" }}>Node.js 20</strong>. Security scanning active across{" "}
              <strong style={{ color: "var(--purple)" }}>198 repositories</strong>. Dependabot alerts and automated fixes enabled globally.
            </div>
          </div>
          <div className="glow-banner-actions">
            <a href="https://github.com/Raphasha27" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <BarChart2 size={14} />
              View on GitHub
            </a>
            <button className="btn btn-secondary" style={{ fontSize: 12 }}>
              <Package size={13} />
              Export Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="section-hd">
            <div className="tabs">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className={`tab ${tab === id ? "active" : ""}`}
                  onClick={() => setTab(id as "pipelines" | "autopilot")}
                >
                  <Icon size={14} strokeWidth={1.8} />
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
              <div className="spinner" />
              Syncing with GitHub…
            </div>
          </div>

          {tab === "pipelines" && <PipelineGrid />}
          {tab === "autopilot" && <AutopilotPanel />}
        </div>

        {/* Bottom two-column */}
        <div className="two-col">
          <div className="panel">
            <div className="section-hd">
              <div className="section-title">
                <div className="st-dot" style={{ background: "var(--purple)", boxShadow: "0 0 7px var(--purple)" }} />
                Security Hub
              </div>
              <a href="https://github.com/Raphasha27/security/dependabot" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                <ExternalLink size={12} />
                View Alerts
              </a>
            </div>
            <SecurityHub />
          </div>

          <div className="panel">
            <div className="section-hd">
              <div className="section-title">
                <div className="st-dot" style={{ background: "var(--green)", boxShadow: "0 0 7px var(--green)" }} />
                Live Activity
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--green)", fontWeight: 600 }}>
                <div className="pulse-dot" style={{ width: 6, height: 6 }} />
                Live
              </div>
            </div>
            <ActivityFeed />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          padding: "14px 0 4px",
          borderTop: "1px solid var(--border)",
          fontSize: 11.5,
          color: "var(--text-muted)",
        }}>
          Nexus Command Center · Built for <strong style={{ color: "var(--cyan)" }}>Raphasha27</strong> · {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}
