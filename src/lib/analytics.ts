export interface TrendPoint {
  date: string;
  success: number;
  failure: number;
  running: number;
  total: number;
  passRate: number;
}

export interface LanguageStat {
  language: string;
  value: number;
}

export interface RunDatum {
  date: string;
  runs: number;
}

export interface PipelineDatum {
  status: string;
  value: number;
}

const DAY = 86_400_000;

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function iso(d: number): string {
  return new Date(d).toISOString().slice(0, 10);
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export function buildTrendSeries(count = 30): TrendPoint[] {
  const out: TrendPoint[] = [];
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const d = now - i * DAY;
    const seed = hash(iso(d));
    const success = 160 + (seed % 25) + (i % 5);
    const failure = (seed % 8) === 0 ? 1 + (seed % 4) : 0;
    const running = (i % 3 === 0) ? 2 + (seed % 4) : 1;
    const total = success + failure + running;
    out.push({
      date: fmt(new Date(d)),
      success,
      failure,
      running,
      total,
      passRate: Math.round((success / total) * 100),
    });
  }
  return out;
}

export function buildRunSeries(count = 30): RunDatum[] {
  const out: RunDatum[] = [];
  const now = Date.now();
  for (let i = count - 1; i >= 0; i--) {
    const d = now - i * DAY;
    const seed = hash(iso(d) + "runs");
    out.push({ date: fmt(new Date(d)), runs: 80 + (seed % 120) });
  }
  return out;
}

export function buildLanguageStats(repos: Array<{ language: string }>): LanguageStat[] {
  const map = new Map<string, number>();
  for (const r of repos) {
    const lang = r.language || "Other";
    map.set(lang, (map.get(lang) || 0) + 1);
  }
  return [...map.entries()]
    .map(([language, value]) => ({ language, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
}

export function buildStatusDistro(repos: Array<{ status: string }>): PipelineDatum[] {
  const map = new Map<string, number>();
  for (const r of repos) {
    map.set(r.status, (map.get(r.status) || 0) + 1);
  }
  return [...map.entries()].map(([status, value]) => ({ status, value }));
}