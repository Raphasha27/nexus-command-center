import { Github, Cloud, Database, Activity, Lock, Terminal, Box, Globe } from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    { name: "GitHub", desc: "Source code & Actions CI/CD", icon: Github, color: "text-white", connected: true },
    { name: "AWS", desc: "Cloud infrastructure provisioning", icon: Cloud, color: "text-amber-500", connected: true },
    { name: "Vercel", desc: "Frontend hosting & serverless", icon: Globe, color: "text-slate-100", connected: true },
    { name: "Datadog", desc: "Observability & APM metrics", icon: Activity, color: "text-purple-400", connected: false },
    { name: "Auth0", desc: "Identity & access management", icon: Lock, color: "text-orange-500", connected: true },
    { name: "Docker", desc: "Container registry & builds", icon: Box, color: "text-blue-400", connected: false },
    { name: "PostgreSQL", desc: "Primary relational database", icon: Database, color: "text-cyan-400", connected: true },
    { name: "Sentry", desc: "Error tracking & performance", icon: Terminal, color: "text-red-400", connected: false },
  ];

  return (
    <div className="space-y-6 animate-in">
      <header>
        <h1 className="text-3xl font-semibold mb-1">Integrations</h1>
        <p className="text-muted">Manage connected services, webhooks, and third-party APIs.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((app) => (
          <div key={app.name} className="card p-5 flex flex-col hover:border-[var(--primary)] transition-colors cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-lg bg-[var(--surface-active)] ${app.color}`}>
                <app.icon size={24} strokeWidth={1.5} />
              </div>
              <div className={`px-2 py-1 text-xs rounded-full font-medium ${app.connected ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
                {app.connected ? "Connected" : "Disconnected"}
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
            <p className="text-muted text-sm flex-1">{app.desc}</p>
            
            <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
              <span className="text-xs text-muted font-mono">{app.connected ? "Active Sync" : "Requires Setup"}</span>
              <button className="text-xs font-medium text-[var(--primary)] hover:text-white transition-colors">
                {app.connected ? "Configure" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
