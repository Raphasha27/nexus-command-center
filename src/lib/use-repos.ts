"use client";
import { useState, useEffect } from "react";
import type { PipelineRepo, OrgStats } from "@/lib/github";

export interface ReposPayload {
  repos: PipelineRepo[];
  stats: OrgStats;
  source: "live" | "demo";
  fetchedAt: string;
}

export function useReposData() {
  const [data, setData] = useState<ReposPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/repos")
      .then((r) => r.json())
      .then((d: ReposPayload) => {
        if (!alive) return;
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        if (!alive) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { data, loading, error };
}
