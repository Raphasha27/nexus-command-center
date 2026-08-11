"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, GitBranch, ShieldCheck, Bot, FolderGit2,
  BarChart2, Bell, ScrollText, Settings, ChevronRight, Hexagon, LogOut, Blocks
} from "lucide-react";

const nav = [
  { href: "/",             icon: LayoutDashboard, label: "Dashboard",      badge: null },
  { href: "/pipelines",    icon: GitBranch,       label: "CI/CD Pipelines",badge: "3" },
  { href: "/security",     icon: ShieldCheck,     label: "Security Hub",   badge: null },
  { href: "/autopilot",    icon: Bot,             label: "Auto-Pilot",     badge: null },
  { href: "/repositories", icon: FolderGit2,      label: "Repositories",   badge: "52", badgeStyle: "green" },
  { href: "/analytics",    icon: BarChart2,       label: "Analytics",      badge: null },
];

const tools = [
  { href: "/alerts",       icon: Bell,       label: "Alerts",       badge: "7" },
  { href: "/integrations", icon: Blocks,     label: "Integrations", badge: null },
  { href: "/activity",     icon: ScrollText, label: "Activity Log", badge: null },
  { href: "/settings",     icon: Settings,   label: "Settings",     badge: null },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Hexagon size={19} strokeWidth={2.5} />
          </div>
          <div className="sidebar-brand">
            <span className="sidebar-brand-name">Nexus CC</span>
            <span className="sidebar-brand-sub">Command Center</span>
          </div>
        </div>

        {/* Main Nav */}
        <span className="sidebar-section">Navigation</span>
        {nav.map(({ href, icon: Icon, label, badge, badgeStyle }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${path === href ? "active" : ""}`}
          >
            <Icon className="si-icon" size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {badge && (
              <span className={`si-badge ${badgeStyle ?? ""}`}>{badge}</span>
            )}
          </Link>
        ))}

        <div className="sidebar-divider" />

        {/* Tools */}
        <span className="sidebar-section">Tools</span>
        {tools.map(({ href, icon: Icon, label, badge }) => (
          <Link
            key={href}
            href={href}
            className={`sidebar-link ${path === href ? "active" : ""}`}
          >
            <Icon className="si-icon" size={17} strokeWidth={1.8} />
            <span>{label}</span>
            {badge && <span className="si-badge">{badge}</span>}
          </Link>
        ))}

        {/* User */}
        <div className="sidebar-bottom">
          <div className="sidebar-divider" />
          <div className="sidebar-user">
            <div className="sidebar-avatar">R</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sidebar-user-name">Raphasha27</div>
              <div className="sidebar-user-role">Admin · Owner</div>
            </div>
            <LogOut size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
