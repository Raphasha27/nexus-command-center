"use client";
import { useEffect, useRef } from "react";
import { ShieldCheck, Bot, Zap, Lock, Key, AlertCircle, AlertTriangle, GitPullRequest } from "lucide-react";

const secItems = [
  { icon: ShieldCheck, label: "Dependabot Alerts",    sub: "198 repositories covered",      value: "Active",    color: "var(--green)" },
  { icon: Bot,         label: "Automated Security Fixes", sub: "Auto-merge on low severity",value: "Active",    color: "var(--green)" },
  { icon: Zap,         label: "CodeQL Analysis",       sub: "JS, Python, TypeScript",       value: "52 repos",  color: "var(--cyan)" },
  { icon: Lock,        label: "Trivy Container Scan",  sub: "Report-only (exit-code: 0)",   value: "Configured",color: "var(--cyan)" },
  { icon: Key,         label: "Secret Scanning",       sub: "GitHub native push protection", value: "Active",   color: "var(--green)" },
  { icon: AlertCircle, label: "Critical Alerts",       sub: "Requires immediate attention", value: "0",         color: "var(--green)" },
  { icon: AlertTriangle,label: "High Alerts",          sub: "Under Dependabot auto-fix",    value: "4",         color: "var(--amber)" },
  { icon: GitPullRequest,label: "Dependabot PRs Closed", sub: "Trivy update PRs cleaned",  value: "57",        color: "var(--cyan)" },
];

const progs = [
  { label: "CI Success Rate",        value: 96,  cls: "green",  display: "96%" },
  { label: "Security Coverage",      value: 100, cls: "",       display: "100%" },
  { label: "Modern Actions (v4+)",   value: 100, cls: "",       display: "100%" },
  { label: "Node 20 Adoption",       value: 100, cls: "",       display: "100%" },
];

export default function SecurityHub() {
  const fillRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fillRefs.current.forEach((el, i) => {
      if (el) {
        requestAnimationFrame(() => {
          setTimeout(() => { el.style.width = `${progs[i].value}%`; }, 150 + i * 80);
        });
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Score Ring */}
      <div className="score-ring-wrap">
        <div className="score-ring-outer">
          <svg className="score-ring-svg" width="130" height="130" viewBox="0 0 130 130">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(187,92%,52%)" />
                <stop offset="100%" stopColor="hsl(258,78%,68%)" />
              </linearGradient>
            </defs>
            <circle className="ring-track" cx="65" cy="65" r="60" />
            <circle className="ring-fill" cx="65" cy="65" r="60" />
          </svg>
          <div className="score-center">
            <span className="score-grade">A+</span>
            <span className="score-label">Security</span>
          </div>
        </div>
      </div>

      {/* Progress bars */}
      {progs.map((p, i) => (
        <div key={p.label} className="prog-wrap">
          <div className="prog-labels">
            <span>{p.label}</span>
            <span>{p.display}</span>
          </div>
          <div className="prog-track">
            <div
              className={`prog-fill ${p.cls}`}
              style={{ width: "0%" }}
              ref={el => { if (el) fillRefs.current[i] = el; }}
            />
          </div>
        </div>
      ))}

      {/* Security items */}
      <div className="sec-items">
        {secItems.map(({ icon: Icon, label, sub, value, color }) => (
          <div key={label} className="sec-item">
            <div className="sec-item-icon" style={{ background: `${color}1a`, color }}>
              <Icon size={16} strokeWidth={1.8} />
            </div>
            <div className="sec-item-info">
              <div className="sec-item-label">{label}</div>
              <div className="sec-item-sub">{sub}</div>
            </div>
            <span className="sec-item-value" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
