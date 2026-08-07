"use client";
import { useState, useEffect } from "react";
import {
  Zap,
  Rocket,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Cpu,
  Workflow,
  Bot,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";
import PipelineGrid from "@/components/PipelineGrid";
import SecurityHub from "@/components/SecurityHub";
import AutopilotPanel from "@/components/AutopilotPanel";
import ActivityFeed from "@/components/ActivityFeed";
import { useReposData } from "@/lib/use-repos";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pipelines" | "autopilot">("pipelines");
  const [time, setTime] = useState("");
  const { data, loading } = useReposData();

  const stats = data
    ? [
        { label: "Total Repositories", value: data.stats?.total.toLocaleString() ?? "–", icon: Boxes, color: "cyan", change: "org-wide", dir: "up" },
        { label: "CI/CD Passing", value: data.stats ? `${data.stats.passRate}%` : "–", icon: CheckCircle2, color: "green", change: `+${(data.stats?.passRate ?? 0) - 62}%`, dir: "up" },
        { label: "Failed Pipelines", value: data.stats ? String(data.stats.failure) : "–", icon: XCircleIcon, color: "red", change: "action needed", dir: "down" },
        { label: "Runs In Progress", value: data.stats ? String(data.stats.running) : "–", icon: Cpu, color: "purple", change: "now", dir: "up" },
      ]
    : null;

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-title">
          <h1>Command Center</h1>
          <p>
            Organization: <strong style={{ color: "var(--accent-cyan)" }}>Raphasha27</strong> ·{" "}
            {data ? `${data.stats?.total ?? 0} repositories monitored` : "syncing repositories…"}
          </p>
        </div>
        <div className="topbar-actions">
          <div className="live-indicator mono">
            <span className="refresh-dot" />
            {time}
          </div>
          <a
            href="https://github.com/Raphasha27"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <GithubIcon width={15} height={15} />
            GitHub
          </a>
          <button className="btn btn-primary" onClick={() => router.push("/#autopilot")}>
            <Rocket size={15} />
            Deploy
          </button>
        </div>
      </header>

      {/* Page content */}
      <div className="page-content">

        {/* Stats */}
        <div className="stats-grid">
          {stats ? (
            stats.map((stat) => (
              <div key={stat.label} className={`stat-card ${stat.color}`}>
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <div className="stat-icon">
                    <stat.icon size={16} />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <span className={`stat-change ${stat.dir}`}>{stat.change}</span>
              </div>
            ))
          ) : (
            <div className="stats-skeleton" style={{ gridColumn: "1/-1" }}>
              <Zap size={18} className="spin-slow" />
              Loading organizational metrics…
            </div>
          )}
        </div>

        {/* Hero Banner */}
        <div className="glow-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.4px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={20} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
              Organization-wide CI/CD Modernization Complete
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: 640 }}>
              {data && data.stats?.total ? (
                <>
                  Live status is available for <strong style={{ color: "var(--accent-cyan)" }}>{data.stats.total} repositories</strong> with a{" "}
                  <strong style={{ color: "var(--accent-cyan)" }}>{data.stats.passRate}% pass rate</strong>. Security scanning, Dependabot
                  alerts and automated fixes remain active org-wide.{" "}
                  <span style={{ color: "var(--text-muted)" }}>
                    Source: {data.source === "live" ? "GitHub Actions API" : "offline demo data"}.
                  </span>
                </>
              ) : (
                "Security scanning is active across the organization. Dependabot alerts and automated fixes are enabled globally."
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
            <a
              href="https://github.com/Raphasha27"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink size={15} />
              View on GitHub
            </a>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => router.push("/repositories")}>
              <Download size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div id="pipelines">
          <div className="section-header">
            <div style={{ display: "flex", gap: 4 }}>
              <button
                className={`filter-pill ${activeTab === "pipelines" ? "active" : ""}`}
                onClick={() => setActiveTab("pipelines")}
              >
                <Workflow size={13} />
                CI/CD Pipelines
              </button>
              <button
                className={`filter-pill ${activeTab === "autopilot" ? "active" : ""}`}
                onClick={() => setActiveTab("autopilot")}
              >
                <Bot size={13} />
                Auto-Pilot
              </button>
            </div>
            <div className="live-indicator">
              <div className="spinner" style={{ width: 13, height: 13 }} />
              {loading ? "Syncing with GitHub…" : "Synced"}
            </div>
          </div>

          {activeTab === "pipelines" && <PipelineGrid />}
          {activeTab === "autopilot" && <AutopilotPanel />}
        </div>

        {/* Bottom two columns */}
        <div className="two-col">
          {/* Security Hub */}
          <div className="panel" id="security">
            <div className="section-header">
              <div className="section-title">
                <div className="dot" style={{ background: "var(--accent-purple)", boxShadow: "0 0 8px var(--accent-purple)" }} />
                Security Hub
              </div>
              <a href="https://github.com/Raphasha27?tab=overview" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }}>
                View Alerts
                <ExternalLink size={11} />
              </a>
            </div>
            <SecurityHub />
          </div>

          {/* Activity Feed */}
          <div className="panel" id="activity">
            <div className="section-header">
              <div className="section-title">
                <div className="dot" style={{ background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }} />
                Live Activity
              </div>
              <span className="live-indicator" style={{ color: "var(--accent-green)" }}>
                <span className="refresh-dot" style={{ width: 6, height: 6 }} />
                Live
              </span>
            </div>
            <ActivityFeed />
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
          Nexus Command Center · Built for <strong style={{ color: "var(--accent-cyan)" }}>Raphasha27</strong> · {new Date().getFullYear()}
        </div>

        <div id="autopilot" style={{ display: "none" }} />
      </div>
    </>
  );
}

function XCircleIcon(props: { size?: number; className?: string }) {
  return <AlertTriangle {...props} />;
}