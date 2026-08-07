import { NextResponse } from "next/server";
import { getPipelineRepos, getOrgStats, isLiveDataEnabled } from "@/lib/github";

export const revalidate = 60;

export async function GET() {
  const [repos, stats] = await Promise.all([getPipelineRepos(), getOrgStats()]);
  return NextResponse.json({
    repos,
    stats,
    source: isLiveDataEnabled() ? "live" : "demo",
    fetchedAt: new Date().toISOString(),
  });
}
