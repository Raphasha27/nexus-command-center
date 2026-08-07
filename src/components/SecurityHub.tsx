"use client";
import { useEffect, useRef } from "react";
import {
  ShieldCheck,
  Lock,
  ScanSearch,
  Box,
  KeyRound,
  AlertTriangle,
  ShieldAlert,
  ListChecks,
} from "lucide-react";

const securityItems = [
  { icon: ShieldCheck, label: "Dependabot Alerts Enabled", sub: "198 repositories covered", value: "Active", color: "text-green" },
  { icon: Lock, label: "Automated Security Fixes", sub: "Auto-merge on low severity", value: "Active", color: "text-green" },
  { icon: ScanSearch, label: "CodeQL Analysis", sub: "JavaScript, Python, TypeScript", value: "52 repos", color: "text-cyan" },
  { icon: Box, label: "Trivy Container Scan", sub: "Exit-code 0 (report only)", value: "Configured", color: "text-cyan" },
  { icon: KeyRound, label: "Secret Scanning", sub: "GitHub native push protection", value: "Active", color: "text-green" },
  { icon: ShieldAlert, label: "Open Critical Alerts", sub: "Requires attention", value: "0", color: "text-green" },
  { icon: AlertTriangle, label: "Open High Alerts", sub: "Under Dependabot auto-fix", value: "4", color: "text-yellow" },
  { icon: ListChecks, label: "Dependabot PRs Closed", sub: "Trivy update PRs cleaned", value: "57", color: "text-cyan" },
];

const progressItems = [
  { label: "CI Success Rate", value: 96, color: "green", display: "96%" },
  { label: "Security Coverage", value: 100, color: "", display: "100%" },
  { label: "Modern Actions (v4+)", value: 100, color: "", display: "100%" },
  { label: "Node 20 Adoption", value: 100, color: "", display: "100%" },
];

export default function SecurityHub() {
  const progressRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    progressRefs.current.forEach((el, i) => {
      if (el) {
        setTimeout(() => {
          el.style.width = `${progressItems[i].value}%`;
        }, 200 + i * 100);
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Score Ring */}
      <div className="security-score-ring">
        <div className="score-ring-outer">
          <svg className="score-ring-svg" width="140" height="140" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(185, 90%, 55%)" />
                <stop offset="100%" stopColor="hsl(262, 80%, 65%)" />
              </linearGradient>
            </defs>
            <circle className="score-ring-track" cx="70" cy="70" r="65" />
            <circle className="score-ring-fill" cx="70" cy="70" r="65" />
          </svg>
          <div className="score-label">
            <span className="score-number">A+</span>
            <span className="score-text">Security Score</span>
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {progressItems.map((item, i) => (
          <div key={item.label} className="progress-bar-wrap">
            <div className="progress-bar-label">
              <span>{item.label}</span>
              <span>{item.display}</span>
            </div>
            <div className="progress-bar-track">
              <div
                className={`progress-bar-fill ${item.color}`}
                ref={el => { if (el) progressRefs.current[i] = el; }}
                style={{ width: "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Security Items */}
      <div className="security-items">
        {securityItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="security-item">
              <span className="security-item-icon">
                <Icon size={16} />
              </span>
              <div className="security-item-info">
                <div className="security-item-label">{item.label}</div>
                <div className="security-item-sub">{item.sub}</div>
              </div>
              <span className={`security-item-value ${item.color}`}>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}