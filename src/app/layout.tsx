import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Nexus Command Center | DevOps Dashboard",
  description: "Advanced GitHub repository monitoring, CI/CD pipeline management, and security analytics dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
