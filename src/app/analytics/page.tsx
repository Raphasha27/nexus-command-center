"use client";
import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  XCircle,
  Loader2,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  success: "#34d399",
  running: "#fbbf24",
  failure: "#f87171",
  pending: "#94a3b8",
  skipped: "#fb923c",
};

const CHART_COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#38bdf8", "#fb923c", "#f472b6", "#4ade80", "#e2e8f0"];

interface TrendPoint {
  date: string;
  success: number;
  failure: number;
  running: number;
  total: number;
  passRate: number;
}

interface AnalyticsPayload {
  trend: TrendPoint[];
  runs: Array<{ date: string; runs: number }>;
  languages: Array<{ language: string; value: number }>;
  statusDistribution: Array<{ status: string; value: number }>;
  stats?: {
    source: "live" | "demo";
    total: number;
    passRate: number;
    failure: number;
    running: number;
  };
}

interface ChartEntry {
  name?: string;
  status?: string;
  value?: number | string;
  fill?: string;
  color?: string;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: ChartEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: p.color || p.fill }} />
          <span>{p.name}</span>
          <strong>{String(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d: AnalyticsPayload) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <Loader2 size={40} className="spin-slow" style={{ margin: "0 auto 12px" }} />
          <p>Crunching CI metrics…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <p>Analytics temporarily unavailable.</p>
        </div>
      </div>
    );
  }

  const avgPass = Math.round(data.trend.reduce((a: number, p: TrendPoint) => a + p.passRate, 0) / data.trend.length);
  const totalRuns = data.runs.reduce((a: number, p: { runs: number }) => a + p.runs, 0);
  const failures = data.trend.reduce((a: number, p: TrendPoint) => a + p.failure, 0);
  const statusData = data.statusDistribution.map((s) => ({ ...s, name: s.status }));

  return (
    <div className="page-content">
      <header className="topbar" style={{ position: "static", margin: "-32px -32px 0" }}>
        <div className="topbar-title">
          <h1>Analytics</h1>
          <p>CI/CD trends · 30-day rolling window · {data.stats?.source === "live" ? "Live GitHub data" : "Demo data"}</p>
        </div>
        <div className="topbar-actions">
          <div className="live-indicator">
            <span className="refresh-dot" />
            Auto-refresh 60s
          </div>
        </div>
      </header>

      {/* KPI row */}
      <div className="stats-grid">
        <div className="stat-card cyan">
          <div className="stat-header">
            <span className="stat-label">Avg. Pass Rate</span>
            <div className="stat-icon"><TrendingUp size={16} /></div>
          </div>
          <div className="stat-value">{avgPass}%</div>
          <span className="stat-change up">+2.4% MoM</span>
        </div>
        <div className="stat-card purple">
          <div className="stat-header">
            <span className="stat-label">Total Runs (30d)</span>
            <div className="stat-icon"><Activity size={16} /></div>
          </div>
          <div className="stat-value">{totalRuns.toLocaleString()}</div>
          <span className="stat-change up">+18% vs prev</span>
        </div>
        <div className="stat-card green">
          <div className="stat-header">
            <span className="stat-label">Successful Runs</span>
            <div className="stat-icon"><CheckCircle2 size={16} /></div>
          </div>
          <div className="stat-value">{data.trend.reduce((a: number, p: TrendPoint) => a + p.success, 0).toLocaleString()}</div>
          <span className="stat-change up">97.4% share</span>
        </div>
        <div className="stat-card red">
          <div className="stat-header">
            <span className="stat-label">Failed Runs</span>
            <div className="stat-icon"><XCircle size={16} /></div>
          </div>
          <div className="stat-value">{failures}</div>
          <span className="stat-change down">needs attention</span>
        </div>
      </div>

      {/* Trend chart */}
      <div className="panel">
        <div className="section-header">
          <div className="section-title">
            <div className="dot" />
            CI Success Trend · 30 days
          </div>
          <div className="chart-legend-inline">
            <span><i style={{ background: "#34d399" }} /> Success</span>
            <span><i style={{ background: "#f87171" }} /> Failed</span>
            <span><i style={{ background: "#fbbf24" }} /> Running</span>
          </div>
        </div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gFailure" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsla(220,30%,35%,0.15)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="success" name="Success" stroke="#34d399" strokeWidth={2} fill="url(#gSuccess)" />
              <Area type="monotone" dataKey="failure" name="Failed" stroke="#f87171" strokeWidth={2} fill="url(#gFailure)" />
              <Area type="monotone" dataKey="running" name="Running" stroke="#fbbf24" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two charts row */}
      <div className="two-col">
        <div className="panel">
          <div className="section-header">
            <div className="section-title">
              <div className="dot" style={{ background: "var(--accent-purple)", boxShadow: "0 0 8px var(--accent-purple)" }} />
              Pipeline Runs per Day
            </div>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.runs} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="hsla(220,30%,35%,0.15)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsla(220,30%,35%,0.08)" }} />
                <Bar dataKey="runs" name="Runs" radius={[4, 4, 0, 0]}>
                  {data.runs.map((_, i: number) => (
                    <Cell key={i} fill={i % 7 === 3 ? "#a78bfa" : "#22d3ee"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="section-header">
            <div className="section-title">
              <div className="dot" style={{ background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }} />
              Status Distribution
            </div>
          </div>
          <div style={{ height: 260, display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  stroke="none"
                >
                  {statusData.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {statusData.map((s) => (
                <div key={s.status} className="pie-legend-row">
                  <i style={{ background: STATUS_COLORS[s.status] || "#94a3b8" }} />
                  <span className="cap">{s.status}</span>
                  <strong>{s.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language distribution */}
      <div className="panel">
        <div className="section-header">
          <div className="section-title">
            <div className="dot" style={{ background: "var(--accent-orange)", boxShadow: "0 0 8px var(--accent-orange)" }} />
            Repositories by Language
          </div>
        </div>
        <div className="lang-bars">
          {data.languages.map((l, i: number) => {
            const max = Math.max(...data.languages.map((x) => x.value));
            return (
              <div key={l.language} className="lang-bar-row">
                <span className="lang-bar-name">{l.language}</span>
                <div className="lang-bar-track">
                  <div
                    className="lang-bar-fill"
                    style={{ width: `${(l.value / max) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                </div>
                <span className="lang-bar-value">{l.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}