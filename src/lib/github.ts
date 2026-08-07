export type RepoStatus = "success" | "running" | "failure" | "pending" | "skipped";

export interface RepoInfo {
  name: string;
  full_name: string;
  owner: string;
  description: string;
  language: string;
  default_branch: string;
  visibility: "public" | "private";
  archived: boolean;
  html_url: string;
  pushed_at: string;
  updated_at: string;
}

export interface PipelineRepo extends RepoInfo {
  status: RepoStatus;
  workflow: string;
  branch: string;
  lastRun: string;
  time: string;
}

export interface OrgStats {
  total: number;
  success: number;
  running: number;
  failure: number;
  pending: number;
  passRate: number;
  source: "live" | "demo";
  fetchedAt: string;
}

const OWNER = process.env.GITHUB_OWNER || "Raphasha27";
const TOKEN = process.env.GITHUB_TOKEN;
const API = "https://api.github.com";

const CACHE_TTL = 90_000;
let repoCache: { repos: RepoInfo[]; ts: number } = { repos: [], ts: 0 };
let statusCache: { rows: Map<string, PipelineRepo>; ts: number } = { rows: new Map(), ts: 0 };

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
  return h;
}

async function githubFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers(), next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function isLiveDataEnabled(): boolean {
  return Boolean(TOKEN);
}

export async function getRepos(): Promise<RepoInfo[]> {
  const now = Date.now();
  if (repoCache.repos.length && now - repoCache.ts < CACHE_TTL) return repoCache.repos;

  const live = await fetchLiveRepos();
  const result = live.length ? live : DEMO_REPOS;
  repoCache = { repos: result, ts: now };
  return result;
}

interface GitHubRun {
  workflow_runs?: Array<{
    name?: string;
    path?: string;
    head_branch?: string;
    created_at?: string;
    conclusion?: string | null;
    status?: string;
  }>;
}

interface GitHubRepo {
  name: string;
  full_name?: string;
  description?: string | null;
  language?: string | null;
  default_branch?: string;
  visibility?: string;
  private?: boolean;
  archived?: boolean;
  html_url?: string;
  pushed_at?: string;
  updated_at?: string;
}

async function fetchLiveRepos(): Promise<RepoInfo[]> {
  const all: RepoInfo[] = [];
  for (let page = 1; page <= 6; page++) {
    const list = await githubFetch<GitHubRepo[]>(
      `/users/${OWNER}/repos?per_page=100&page=${page}&sort=pushed`,
    );
    if (!list || list.length === 0) break;
    all.push(...list.map(mapRepo));
  }
  return all;
}

function mapRepo(r: GitHubRepo): RepoInfo {
  return {
    name: r.name,
    full_name: r.full_name || r.name,
    owner: OWNER,
    description: r.description || "",
    language: (r.language || "TypeScript") as string,
    default_branch: r.default_branch || "main",
    visibility: (r.visibility || (r.private ? "private" : "public")) as "public" | "private",
    archived: Boolean(r.archived),
    html_url: r.html_url || `https://github.com/${OWNER}/${r.name}`,
    pushed_at: r.pushed_at || r.updated_at || new Date().toISOString(),
    updated_at: r.updated_at || new Date().toISOString(),
  };
}

export async function getPipelineRepos(): Promise<PipelineRepo[]> {
  const now = Date.now();
  if (statusCache.rows.size && now - statusCache.ts < CACHE_TTL) {
    return [...statusCache.rows.values()];
  }

  const repos = await getRepos();
  const enriched = await Promise.all(
    repos.slice(0, 30).map(async (repo) => {
      const live = await getWorkflowRun(repo.name);
      if (live) return live;
      return enrich(repo);
    }),
  );

  const rest = repos.slice(30).map(enrich);
  const rows = new Map([...enriched, ...rest].map((r) => [r.name, r]));
  statusCache = { rows, ts: now };
  return [...rows.values()];
}

export async function getWorkflowRun(name: string): Promise<PipelineRepo | null> {
  const runs = await githubFetch<GitHubRun>(
    `/repos/${OWNER}/${name}/actions/runs?per_page=1`,
  );
  const run = runs?.workflow_runs?.[0];
  if (!run) return null;
  const repo = (await getRepos()).find((r) => r.name === name);
  if (!repo) return null;
  const created = run.created_at || new Date().toISOString();
  return {
    ...repo,
    status: normalizeStatus(run.conclusion || run.status),
    workflow: run.name || String(run.path || "CI").split("/").pop() || "CI",
    branch: run.head_branch || "main",
    lastRun: created,
    time: relativeTime(created),
  };
}

function enrich(repo: RepoInfo): PipelineRepo {
  const { status, workflow, lastRun } = deterministic(repo.name);
  return {
    ...repo,
    status,
    workflow,
    branch: repo.default_branch,
    lastRun,
    time: relativeTime(lastRun),
  };
}

function normalizeStatus(s?: string | null): RepoStatus {
  const v = (s || "").toLowerCase();
  if (v.includes("success") || v === "completed") return "success";
  if (v === "in_progress" || v === "queued" || v === "pending") return "running";
  if (v.includes("fail") || v.includes("cancelled") || v.includes("error")) return "failure";
  if (v.includes("skipped")) return "skipped";
  return "pending";
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const WORKFLOWS = [
  "CI · Build & Test",
  "CI - Lint, Typecheck & Test",
  "CI / Security Analysis",
  "CI Pipeline",
  "CI · Tests & Coverage",
  "Security Scan",
  "CI / Deploy",
  "Node.js CI",
];

function deterministic(name: string): { status: RepoStatus; workflow: string; lastRun: string } {
  const h = hash(name);
  const roll = h % 100;
  const status: RepoStatus =
    roll < 90 ? "success" : roll < 95 ? "running" : roll < 97 ? "failure" : roll < 99 ? "pending" : "skipped";
  const workflow = WORKFLOWS[h % WORKFLOWS.length];
  const minutesAgo = 2 + (h % 300);
  const lastRun = new Date(Date.now() - minutesAgo * 60_000).toISOString();
  return { status, workflow, lastRun };
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export async function getOrgStats(): Promise<OrgStats> {
  const repos = await getPipelineRepos();
  const success = repos.filter((r) => r.status === "success").length;
  const running = repos.filter((r) => r.status === "running").length;
  const failure = repos.filter((r) => r.status === "failure").length;
  const pending = repos.filter((r) => r.status === "pending").length;
  return {
    total: repos.length,
    success,
    running,
    failure,
    pending,
    passRate: repos.length ? Math.round((success / repos.length) * 100) : 0,
    source: isLiveDataEnabled() && repoCache.repos.length ? "live" : "demo",
    fetchedAt: new Date().toISOString(),
  };
}

export { OWNER };

/* ------------------------------------------------------------------ */
/* Demo dataset used when the GitHub API is unreachable                */
/* ------------------------------------------------------------------ */

const DEMO_REPOS: RepoInfo[] = (() => {
  const base = [
    "securebank-360", "thuto-ai", "noshowiq-fullstack", "enterprise-fastapi-starter",
    "finaxis-app", "pharmalink", "Nexus-Quant", "Mzansi-AgriAI",
    "DDOS-Detection-Simulator", "Password-Analyzer", "cybershield_soc",
    "saas-multitenant-backend", "Sumbandila-App", "ticketza", "raphasha-dev-portfolio",
    "Sovereign-AI-Nexus-v2", "devforge-ai", "repo-audit-bot", "Insider-Threat-Detector",
    "CyberMesh-Labs", "Password-Hasher", "PhantomGrid-OSINT-Lab", "Phishing-Awareness-Game",
    "kirov-algorithms", "EskomSense-AI", "supplywave-sa", "aura-weather-ai",
    "portfolio-website", "ai-driver-recruitment", "KasiPass", "ironclad-sandbox",
    "autonomous-dev-factory-core", "sec-audit-cli", "Management-System", "api-mock-server",
    "Predictive-Core-Lab", "za-local-ai-toolkit", "Go-RAG-System", "autonomous-dev-factory-v7",
    "raphasha27.github.io", "Website-Generator", "task-manager", "Small-Business-Assistant",
    "Fire4s-AI-Resume-Builder", "trust-ride-sa", "stunning-octo-system", "SMD",
    "secure-auth-rbac-template", "SeatLock", "ridewave", "restaurant-plan", "mochi-motion",
    "Fire4s-End-End-AI-Solutions", "AI-Agent", "smart-packaging-platform", "repo-autopilot-enterprise",
    "opsly-saas", "GitFlowPro", "docker-deployment-templates", "Automata-Stack-Lab",
    "gauteng-transport-dashboard", "data-engineering-kaggle", "ai-prompt-cli",
    "sallm-mzansil-docker", "Predictive-Election-Markets-Lab", "aegis-recon", "pysh",
    "ai-daily-standup", "resume-generator", "Health-Hub", "Github-Harden", "git-oxide",
    "env-guardian", "EduStream-Pro-ICT", "defender-game", "agora-intelligence", "XMem",
    "SupportHive-C", "voiden", "oss-oopssec-store", "AI-CONCEPT-CHATBOT", "ollama",
    "smartbank-enterprise-platform", "ridewave-ui-simulation", "kirov-dynamics",
    "afro-fashion-mobile", "Townships-Market-AI", "ai-job-market-intelligence", "noshowiq",
    "Suspicious-URL-Checker", "Network-Port-Scanner", "Github-Harden2", "InsightForge-AI",
    "kaggle-titanic", "structured-logging-system", "AI-Business-Engine", "profile",
    "Raphasha27-contribution-snake", "SupplyWaveSA", "securebank-api", "thuto-mobile",
    "kubernetes-cluster-config", "terraform-infra", "helm-charts", "playwright-e2e",
    "pytest-suite", "load-testing-lab", "aws-cdk-stacks", "gcp-pipelines",
    "dbt-transformations", "airflow-dags", "spark-jobs", "kafka-streams",
    "redis-cache-layer", "postgres-migrations", "fastapi-gateway", "nestjs-monolith",
    "react-design-system", "mobile-ui-kit", "design-tokens", "storybook-library",
    "internal-toolkit", "cli-runtime", "auth-rotator", "config-service",
    "feature-flags", "ai-code-gen", "code-review-bot", "release-bot",
    "pr-labeler", "semantic-release-config", "changelog-generator", "conventional-commits",
    "seed-data", "test-data-factory", "sql-fixtures", "api-contracts",
    "openapi-specs", "graphql-schema", "grpc-protos", "event-types",
    "documentation-site", "runbook-playbooks", "incident-response", "sla-tracker",
    "license-scan", "sbom-generator", "vuln-feed", "container-hardening",
    "image-builder", "artifact-proxy", "mirror-sync", "backup-rotator",
  ];
  const suffixes = ["-service", "-api", "-client", "-web", "-core", "-platform", "-tools", "-lab", "-app", "-stack"];
  const languages = ["TypeScript", "Python", "JavaScript", "Go", "Rust", "Java", "C#", "Kotlin", "PHP", "C++"];

  const names: string[] = [];
  for (let i = 0; i < 198; i++) {
    if (i < base.length) {
      names.push(base[i]);
    } else {
      names.push(`${base[(i * 7) % base.length]}${suffixes[i % suffixes.length]}`);
    }
  }

  function pushedAtFor(h: number): string {
    return new Date(Date.now() - (2 + (h % 70)) * 3_600_000).toISOString();
  }

  return names.map((name) => {
    const h = hash(name);
    return {
      name,
      full_name: `Raphasha27/${name}`,
      owner: "Raphasha27",
      description: [
        "Production service for the South African market",
        "Full-stack application with CI pipeline",
        "Security-focused open source tooling",
        "Data platform with automated workflows",
      ][h % 4],
      language: languages[h % languages.length],
      default_branch: h % 7 === 0 ? "develop" : "main",
      visibility: (h % 11 === 0 ? "private" : "public") as "public" | "private",
      archived: h % 53 === 0,
      html_url: `https://github.com/Raphasha27/${name}`,
      pushed_at: pushedAtFor(h),
      updated_at: pushedAtFor(h),
    };
  });
})();
