"use client";
import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, GitBranch, ShieldCheck, BarChart2, ExternalLink } from "lucide-react";

const initialCiTrend = [
  { day: "Mon", pass: 44, fail: 3 },
  { day: "Tue", pass: 48, fail: 2 },
  { day: "Wed", pass: 46, fail: 5 },
  { day: "Thu", pass: 50, fail: 1 },
  { day: "Fri", pass: 51, fail: 2 },
  { day: "Sat", pass: 49, fail: 0 },
  { day: "Sun", pass: 52, fail: 0 },
];

const prsMerged = [
  { week: "W1", prs: 8 }, { week: "W2", prs: 14 }, { week: "W3", prs: 22 },
  { week: "W4", prs: 57 }, { week: "W5", prs: 5 },
];

const langDist = [
  { name: "Python",     value: 28, color: "hsl(40,94%,56%)" },
  { name: "TypeScript", value: 16, color: "hsl(212,90%,60%)" },
  { name: "JavaScript", value: 5,  color: "hsl(52,95%,55%)" },
  { name: "Go",         value: 2,  color: "hsl(187,92%,52%)" },
  { name: "Shell",      value: 1,  color: "hsl(148,72%,48%)" },
];

const initialSecTrend = [
  { day: "Mon", alerts: 12 }, { day: "Tue", alerts: 9 },
  { day: "Wed", alerts: 7 },  { day: "Thu", alerts: 5 },
  { day: "Fri", alerts: 4 },  { day: "Sat", alerts: 4 }, { day: "Sun", alerts: 4 },
];

const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
  if (active && payload && (payload as unknown[]).length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-glow)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 14px",
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 6 }}>{label as string}</div>
        {(payload as Array<{ name: string; value: number; color: string }>).map((p) => (
          <div key={p.name} style={{ color: p.color, display: "flex", gap: 10, justifyContent: "space-between" }}>
            <span>{p.name}</span>
            <strong>{p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [ciTrend, setCiTrend] = useState(initialCiTrend);
  const [secTrend, setSecTrend] = useState(initialSecTrend);

  useEffect(() => {
    const interval = setInterval(() => {
      setCiTrend(prev => prev.map(p => ({
        ...p,
        pass: p.pass + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0),
        fail: p.fail + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0)
      })));
      setSecTrend(prev => prev.map(p => ({
        ...p,
        alerts: Math.max(0, p.alerts + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Analytics</div>
          <div className="topbar-sub">7-day pipeline &amp; security trends across your organization</div>
        </div>
        <div className="topbar-right">
          <a href="https://github.com/Raphasha27" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            <ExternalLink size={14} />
            GitHub Insights
          </a>
        </div>
      </header>

      <div className="page">
        {/* Stat summary */}
        <div className="stats-row">
          {[
            { label: "Avg Daily Runs",    value: "49",  accent: "cyan",   icon: GitBranch },
            { label: "Weekly PRs Merged", value: "57",  accent: "purple", icon: TrendingUp },
            { label: "Security Alerts ↓", value: "−67%",accent: "green",  icon: ShieldCheck },
            { label: "Success Rate",      value: "96%", accent: "green",  icon: BarChart2 },
          ].map(({ label, value, accent, icon: Icon }) => (
            <div key={label} className="stat-card" data-accent={accent}>
              <div className="sc-header">
                <span className="sc-label">{label}</span>
                <div className="sc-icon"><Icon size={18} strokeWidth={1.8} /></div>
              </div>
              <div className="sc-value">{value}</div>
              <div className="sc-footer">
                <span className="sc-change"><TrendingUp size={11} /> This week</span>
              </div>
            </div>
          ))}
        </div>

        {/* CI Trend */}
        <div className="panel">
          <div className="section-hd">
            <div className="section-title">
              <div className="st-dot" style={{ background: "var(--cyan)" }} />
              CI/CD Pipeline Trend — Last 7 Days
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ciTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="passGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(148,72%,48%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(148,72%,48%)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="failGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(0,76%,62%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(0,76%,62%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Area type="monotone" dataKey="pass" name="Passing" stroke="hsl(148,72%,48%)" fill="url(#passGrad)" strokeWidth={2} dot={{ fill: "hsl(148,72%,48%)", r: 3 }} />
                <Area type="monotone" dataKey="fail" name="Failed"  stroke="hsl(0,76%,62%)"   fill="url(#failGrad)"  strokeWidth={2} dot={{ fill: "hsl(0,76%,62%)",   r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two charts */}
        <div className="two-col">
          {/* PRs merged */}
          <div className="panel">
            <div className="section-hd">
              <div className="section-title">
                <div className="st-dot" style={{ background: "var(--purple)" }} />
                Dependabot PRs Merged
              </div>
            </div>
            <div className="chart-wrap" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prsMerged} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                  <Bar dataKey="prs" name="PRs Merged" fill="hsl(258,78%,68%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language distribution */}
          <div className="panel">
            <div className="section-hd">
              <div className="section-title">
                <div className="st-dot" style={{ background: "var(--amber)" }} />
                Language Distribution
              </div>
            </div>
            <div className="chart-wrap" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={langDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3}>
                    {langDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Legend formatter={(val) => <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{val}</span>} />
                  <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Security alerts trend */}
        <div className="panel">
          <div className="section-hd">
            <div className="section-title">
              <div className="st-dot" style={{ background: "var(--red)" }} />
              Open Security Alerts — Trend
            </div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={secTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="alertGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(0,76%,62%)" />
                    <stop offset="100%" stopColor="hsl(148,72%,48%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Line type="monotone" dataKey="alerts" name="Open Alerts" stroke="url(#alertGrad)" strokeWidth={2.5} dot={{ fill: "hsl(0,76%,62%)", r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
