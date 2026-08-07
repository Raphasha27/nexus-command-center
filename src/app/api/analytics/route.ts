import { NextResponse } from "next/server";
import { getPipelineRepos, getOrgStats } from "@/lib/github";
import {
  buildTrendSeries,
  buildRunSeries,
  buildLanguageStats,
  buildStatusDistro,
} from "@/lib/analytics";

export const revalidate = 60;

export async function GET() {
  const repos = await getPipelineRepos();
  const stats = await getOrgStats();

  return NextResponse.json({
    trend: buildTrendSeries(30),
    runs: buildRunSeries(30),
    languages: buildLanguageStats(repos),
    statusDistribution: buildStatusDistro(repos),
    stats,
  });
}