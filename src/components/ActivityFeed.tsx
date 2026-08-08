"use client";
import { CheckCircle2, ShieldCheck, GitPullRequest, Lock, Zap, GitMerge, Bot, Bug } from "lucide-react";

const events = [
  { dot: "green",  icon: CheckCircle2,    msg: <><strong>securebank-360</strong> — CI pipeline passed successfully</>,          time: "2m ago" },
  { dot: "green",  icon: CheckCircle2,    msg: <><strong>noshowiq-fullstack</strong> — CI Lint, Typecheck &amp; Test passed</>, time: "8m ago" },
  { dot: "cyan",   icon: ShieldCheck,     msg: <><strong>198 repos</strong> — Dependabot alerts &amp; security fixes enabled</>,time: "2h ago" },
  { dot: "green",  icon: CheckCircle2,    msg: <><strong>pharmalink</strong> — Workflow fixes pushed successfully</>,           time: "2h ago" },
  { dot: "green",  icon: CheckCircle2,    msg: <><strong>Raphasha27-contribution-snake</strong> — Workflow fixed</>,           time: "2h ago" },
  { dot: "green",  icon: CheckCircle2,    msg: <><strong>autonomous-dev-factory-core</strong> — CI now passing</>,             time: "3h ago" },
  { dot: "purple", icon: GitMerge,        msg: <><strong>57 Dependabot PRs</strong> — Merged across organization</>,          time: "3h ago" },
  { dot: "cyan",   icon: Zap,            msg: <><strong>52 repositories</strong> — Upgraded to Actions v4 / Node 20</>,       time: "4h ago" },
  { dot: "green",  icon: Bug,             msg: <><strong>Nexus-Quant</strong> — Merge conflicts resolved &amp; CI fixed</>,    time: "5h ago" },
  { dot: "cyan",   icon: ShieldCheck,     msg: <><strong>CodeQL</strong> — Security scanning enabled globally</>,             time: "6h ago" },
  { dot: "cyan",   icon: Lock,            msg: <><strong>Trivy</strong> — Pinned to v0.28.0 across all repos</>,              time: "7h ago" },
  { dot: "green",  icon: CheckCircle2,    msg: <><strong>repo-audit-bot</strong> — CI workflow fixed and pushed</>,           time: "8h ago" },
];

export default function ActivityFeed() {
  return (
    <div className="activity-list">
      {events.map((e, i) => (
        <div key={i} className="activity-row">
          <div className={`act-dot ${e.dot}`} />
          <div className="act-body">
            <div className="act-msg">{e.msg}</div>
            <div className="act-time">{e.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
