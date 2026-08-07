"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  RefreshCw,
  Shield,
  Bot,
  Globe,
  BarChart3,
  Bell,
  Activity,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { GithubIcon } from "@/components/GithubIcon";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", badge: null },
  { icon: Globe, label: "Repositories", href: "/repositories", badge: null },
  { icon: BarChart3, label: "Analytics", href: "/analytics", badge: null },
];

const monitorItems = [
  { icon: RefreshCw, label: "CI/CD Pipelines", href: "/#pipelines", badge: "3" },
  { icon: Shield, label: "Security Hub", href: "/#security", badge: null },
  { icon: Bot, label: "Auto-Pilot", href: "/#autopilot", badge: null },
];

const toolItems = [
  { icon: Bell, label: "Alerts", href: "/#alerts", badge: "7" },
  { icon: Activity, label: "Activity Log", href: "/#activity", badge: null },
  { icon: Settings, label: "Settings", href: "/settings", badge: null },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return pathname === "/";
  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();
  const [repoCount, setRepoCount] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/repos")
      .then((r) => r.json())
      .then((d) => setRepoCount(String(d.stats?.total ?? 0)))
      .catch(() => {});
  }, []);

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <GithubIcon width={18} height={18} />
        </div>
        <span className="sidebar-logo-text">Nexus CC</span>
      </Link>

      <span className="sidebar-section-label">Navigation</span>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-link ${isActive(item.href, pathname) ? "active" : ""}`}
        >
          <span className="icon">
            <item.icon size={16} strokeWidth={2} />
          </span>
          <span>{item.label}</span>
          {item.href === "/repositories" && (
            <span className="badge green">{repoCount ?? "…"}</span>
          )}
        </Link>
      ))}

      <span className="sidebar-section-label">Monitor</span>
      {monitorItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-link ${isActive(item.href, pathname) ? "active" : ""}`}
        >
          <span className="icon">
            <item.icon size={16} strokeWidth={2} />
          </span>
          <span>{item.label}</span>
          {item.badge && <span className="badge">{item.badge}</span>}
        </Link>
      ))}

      <div className="sidebar-divider" />

      <span className="sidebar-section-label">Tools</span>
      {toolItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`sidebar-link ${isActive(item.href, pathname) ? "active" : ""}`}
        >
          <span className="icon">
            <item.icon size={16} strokeWidth={2} />
          </span>
          <span>{item.label}</span>
          {item.badge && <span className="badge">{item.badge}</span>}
        </Link>
      ))}

      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <div className="sidebar-user">
          <div className="sidebar-avatar">R</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Raphasha27</div>
            <div className="sidebar-user-role">Admin · Owner</div>
          </div>
        </div>
        <div className="sidebar-support">
          <LifeBuoy size={14} />
          <span>Support & Docs</span>
        </div>
      </div>
    </aside>
  );
}