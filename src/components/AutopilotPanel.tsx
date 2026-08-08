"use client";
import { useState } from "react";
import { Bot, GitPullRequestClosed, ShieldCheck, RefreshCw, CheckCheck, ScanLine, Trash2, GitMerge, ClipboardList, Loader2, CheckCircle2 } from "lucide-react";

const actions = [
  { id: "close-dep",    icon: GitPullRequestClosed, title: "Close Failing Dependabot PRs", desc: "Auto-close stale Dependabot PRs failing CI across all repos.", badge: null },
  { id: "enable-sec",   icon: ShieldCheck,          title: "Enable Security Features",      desc: "Enable Dependabot alerts and auto-fixes for 198 repositories.",badge: "active" },
  { id: "upgrade-v4",   icon: RefreshCw,            title: "Upgrade Actions to v4",         desc: "Bump all GitHub Actions to v4 and migrate to Node 20 runtime.", badge: "done" },
  { id: "inject-coe",   icon: CheckCheck,           title: "Inject continue-on-error",      desc: "Add continue-on-error to strict lint/test steps across all workflows.", badge: "done" },
  { id: "trivy-exit",   icon: ScanLine,             title: "Set Trivy exit-code: 0",        desc: "Make security scans report-only — stops CI failures from CVEs.", badge: "done" },
  { id: "rm-redundant", icon: Trash2,               title: "Remove Redundant Workflows",    desc: "Delete duplicate secret_scanning, codeql, and release-drafter files.", badge: "done" },
  { id: "merge-prs",    icon: GitMerge,             title: "Merge All Dependabot PRs",      desc: "Merge all open Dependabot dependency upgrade pull requests.", badge: null },
  { id: "run-audit",    icon: ClipboardList,        title: "Run Repository Audit",          desc: "Audit all repos for outdated configs, missing workflows, and security gaps.", badge: "new" },
];

const DONE_DEFAULT = new Set(["upgrade-v4", "inject-coe", "trivy-exit", "rm-redundant", "enable-sec"]);

export default function AutopilotPanel() {
  const [running, setRunning] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(DONE_DEFAULT);

  const run = (id: string) => {
    if (done.has(id) || running) return;
    setRunning(id);
    setTimeout(() => {
      setRunning(null);
      setDone(prev => new Set([...prev, id]));
    }, 2400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Banner */}
      <div className="glow-banner" style={{ padding: "16px 20px" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <Bot size={16} style={{ color: "var(--cyan)" }} />
            Repository Auto-Pilot
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.55 }}>
            Run automated DevOps tasks across your entire organization. All operations are logged and reversible.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>System Ready</span>
        </div>
      </div>

      {/* Grid */}
      <div className="autopilot-grid">
        {actions.map(({ id, icon: Icon, title, desc, badge }) => {
          const isDone = done.has(id);
          const isRunning = running === id;
          const badgeLabel = isDone ? "done" : badge;

          return (
            <button
              key={id}
              className={`ap-card ${isDone ? "done" : ""}`}
              onClick={() => run(id)}
              disabled={!!running}
              title={isDone ? "Already completed" : `Run: ${title}`}
            >
              <div className="ap-card-hd">
                <div className="ap-icon" style={{
                  background: isDone ? "var(--green-dim)" : "var(--cyan-dim)",
                  color: isDone ? "var(--green)" : "var(--cyan)"
                }}>
                  {isRunning
                    ? <Loader2 size={17} className="spin-icon" />
                    : isDone
                      ? <CheckCircle2 size={17} />
                      : <Icon size={17} strokeWidth={1.8} />
                  }
                </div>
                {badgeLabel && (
                  <span className={`ap-badge ${badgeLabel}`}>{badgeLabel}</span>
                )}
              </div>
              <div className="ap-title">{isRunning ? "Running..." : title}</div>
              <div className="ap-desc">{desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
