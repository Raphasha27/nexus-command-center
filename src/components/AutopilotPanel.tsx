"use client";
import { useState } from "react";
import {
  Bot,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Lock,
  Eraser,
  ArrowUpToLine,
  ClipboardList,
  Rocket,
  Loader2,
} from "lucide-react";

const actions = [
  {
    id: "close-dependabot",
    icon: Bot,
    title: "Close Failing Dependabot PRs",
    desc: "Auto-close stale Dependabot PRs that are failing CI across all repos.",
    tag: null,
  },
  {
    id: "enable-security",
    icon: ShieldCheck,
    title: "Enable Security Features",
    desc: "Enable Dependabot alerts and auto-fixes for all 198 repositories.",
    tag: "Active",
  },
  {
    id: "update-actions",
    icon: RefreshCw,
    title: "Upgrade Actions to v4",
    desc: "Bump all GitHub Actions to v4 and migrate to Node 20 runtime.",
    tag: "Done",
  },
  {
    id: "inject-coe",
    icon: ShieldCheck,
    title: "Inject continue-on-error",
    desc: "Add continue-on-error to strict lint/test steps across all workflows.",
    tag: "Done",
  },
  {
    id: "exit-code",
    icon: Lock,
    title: "Set Trivy exit-code: 0",
    desc: "Make security scans report-only. Stops CI failures due to known CVEs.",
    tag: "Done",
  },
  {
    id: "remove-redundant",
    icon: Eraser,
    title: "Remove Redundant Workflows",
    desc: "Delete duplicate secret_scanning.yml, codeql.yml and release-drafter.yml files.",
    tag: "Done",
  },
  {
    id: "merge-prs",
    icon: ArrowUpToLine,
    title: "Merge All Dependabot PRs",
    desc: "Merge all open Dependabot dependency upgrade pull requests.",
    tag: null,
  },
  {
    id: "run-audit",
    icon: ClipboardList,
    title: "Run Repository Audit",
    desc: "Audit all repos for outdated configs, missing workflows, and security gaps.",
    tag: "new" as const,
  },
];

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  Done: { bg: "var(--accent-green-dim)", color: "var(--accent-green)" },
  Active: { bg: "var(--accent-cyan-dim)", color: "var(--accent-cyan)" },
  new: { bg: "var(--accent-purple-dim)", color: "var(--accent-purple)" },
};

export default function AutopilotPanel() {
  const [running, setRunning] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set(["update-actions", "inject-coe", "exit-code", "remove-redundant", "enable-security"]));

  const handleRun = (id: string) => {
    if (done.has(id)) return;
    setRunning(id);
    setTimeout(() => {
      setRunning(null);
      setDone(prev => new Set([...prev, id]));
    }, 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        className="glow-card"
        style={{ marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <Rocket size={16} style={{ color: "var(--accent-purple)" }} />
            Repository Auto-Pilot
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Run automated DevOps tasks across your entire organization with one click. All operations are logged.
          </div>
        </div>
        <div className="live-indicator" style={{ color: "var(--accent-green)" }}>
          <div className="refresh-dot" style={{ width: 7, height: 7 }} />
          System Ready
        </div>
      </div>

      <div className="autopilot-grid">
        {actions.map((action) => {
          const isDone = done.has(action.id);
          const isRunning = running === action.id;
          const tagStyle = action.tag ? TAG_STYLES[action.tag] : null;
          const Icon = isRunning ? Loader2 : isDone ? CheckCircle2 : action.icon;

          return (
            <button
              key={action.id}
              className={`autopilot-action ${isDone ? "active-state" : ""}`}
              onClick={() => handleRun(action.id)}
              disabled={isRunning}
              title={isDone ? "Already completed" : `Run: ${action.title}`}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span className={`autopilot-action-icon ${isRunning ? "spin-slow" : ""}`}>
                  <Icon size={20} style={{ color: isDone ? "var(--accent-green)" : isRunning ? "var(--accent-orange)" : "var(--accent-cyan)" }} />
                </span>
                {action.tag && tagStyle && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: tagStyle.bg,
                    color: tagStyle.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}>
                    {isDone && action.tag !== "Done" ? "Done" : action.tag}
                  </span>
                )}
              </div>
              <div className="autopilot-action-title">
                {isRunning ? "Running…" : action.title}
              </div>
              <div className="autopilot-action-desc">{action.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}