"use client";
import SecurityHub from "@/components/SecurityHub";
import { ShieldCheck, ExternalLink } from "lucide-react";

export default function SecurityPage() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Security Hub</div>
          <div className="topbar-sub">Vulnerability alerts, CodeQL scans, and Dependabot status</div>
        </div>
        <div className="topbar-right">
          <a href="https://github.com/Raphasha27/security/dependabot" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink size={14} />
            View Alerts
          </a>
        </div>
      </header>
      <div className="page">
        <div className="two-col" style={{ alignItems: "start" }}>
          <div className="panel">
            <div className="section-hd">
              <div className="section-title">
                <div className="st-dot" style={{ background: "var(--purple)", boxShadow: "0 0 7px var(--purple)" }} />
                Security Overview
              </div>
            </div>
            <SecurityHub />
          </div>
          <div className="panel">
            <div className="section-hd">
              <div className="section-title">
                <div className="st-dot" style={{ background: "var(--cyan)" }} />
                Coverage by Feature
              </div>
            </div>
            {[
              { label: "Dependabot Alerts",    value: "198/198 repos", color: "var(--green)" },
              { label: "Secret Scanning",      value: "198/198 repos", color: "var(--green)" },
              { label: "Code Scanning (CodeQL)",value: "52/52 repos",  color: "var(--cyan)" },
              { label: "Container Scanning",    value: "52/52 repos",  color: "var(--cyan)" },
              { label: "Branch Protection",     value: "52/52 repos",  color: "var(--green)" },
              { label: "Automated Security Fixes", value: "198/198 repos", color: "var(--green)" },
            ].map(item => (
              <div key={item.label} className="sec-item" style={{ marginBottom: 8 }}>
                <div className="sec-item-info">
                  <div className="sec-item-label">{item.label}</div>
                </div>
                <span className="sec-item-value" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
