"use client";
import AutopilotPanel from "@/components/AutopilotPanel";

export default function AutopilotPage() {
  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Auto-Pilot</div>
          <div className="topbar-sub">One-click DevOps automation across your entire organization</div>
        </div>
      </header>
      <div className="page">
        <AutopilotPanel />
      </div>
    </>
  );
}
