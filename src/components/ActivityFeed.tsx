"use client";
import { CheckCircle2, Info, GitMerge, Sparkles, XCircle } from "lucide-react";

const DOT_ICON: Record<string, typeof CheckCircle2> = {
  green: CheckCircle2,
  red: XCircle,
  cyan: Info,
  purple: GitMerge,
  yellow: Sparkles,
};

const activities = [
  { dot: "green", msg: <><strong>securebank-360</strong> · CI pipeline passed successfully</>, time: "2m ago" },
  { dot: "green", msg: <><strong>noshowiq-fullstack</strong> · CI - Lint, Typecheck &amp; Test passed</>, time: "8m ago" },
  { dot: "cyan", msg: <><strong>All 198 repos</strong> · Dependabot alerts &amp; security fixes enabled</>, time: "2h ago" },
  { dot: "green", msg: <><strong>pharmalink</strong> · Workflow fixes pushed successfully</>, time: "2h ago" },
  { dot: "cyan", msg: <><strong>Raphasha27-contribution-snake</strong> · Workflow fixed and pushed</>, time: "2h ago" },
  { dot: "green", msg: <><strong>autonomous-dev-factory-core</strong> · CI now passing</>, time: "3h ago" },
  { dot: "purple", msg: <><strong>57 Dependabot PRs</strong> · Merged across organization</>, time: "3h ago" },
  { dot: "cyan", msg: <><strong>52 repositories</strong> · Actions upgraded to v4 / Node 20</>, time: "4h ago" },
  { dot: "green", msg: <><strong>Nexus-Quant</strong> · Merge conflicts resolved &amp; CI fixed</>, time: "5h ago" },
  { dot: "purple", msg: <><strong>CodeQL</strong> · Security scanning enabled globally</>, time: "6h ago" },
  { dot: "cyan", msg: <><strong>Trivy</strong> · Pinned to v0.28.0 across all repos</>, time: "7h ago" },
  { dot: "green", msg: <><strong>repo-audit-bot</strong> · CI workflow fixed and pushed</>, time: "8h ago" },
];

export default function ActivityFeed() {
  return (
    <div className="activity-feed">
      {activities.map((item, i) => {
        const Icon = DOT_ICON[item.dot] ?? Info;
        return (
          <div key={i} className="activity-item">
            <div className={`activity-dot ${item.dot}`}>
              <Icon size={12} />
            </div>
            <div className="activity-info">
              <div className="activity-msg">{item.msg}</div>
              <div className="activity-time">{item.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}