import { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  doc, getDoc, collection, getDocs, query,
  orderBy, limit
} from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Reveal from "@/components/reveal";

interface Visit {
  path: string;
}

interface DailyCount {
  date: string;
  count: number;
}

interface PathCount {
  path: string;
  count: number;
}

export default function VisitorAnalytics() {
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [topPages, setTopPages] = useState<PathCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [totalSnap, dailySnap, visitsSnap] = await Promise.all([
          getDoc(doc(db, "stats", "visitors")),
          getDocs(query(collection(db, "dailyStats"), orderBy("date", "desc"), limit(7))),
          getDocs(query(collection(db, "visits"), orderBy("timestamp", "desc"), limit(100))),
        ]);

        const total = totalSnap.data()?.total ?? 0;
        setTotalVisits(total);

        const days = dailySnap.docs
          .map((d) => d.data() as DailyCount)
          .sort((a, b) => a.date.localeCompare(b.date));
        setDailyCounts(days);

        const todayStr = days.find((d) => d.date === new Date().toISOString().slice(0, 10));
        setTodayVisits(todayStr?.count ?? 0);

        const pathMap = new Map<string, number>();
        for (const d of visitsSnap.docs) {
          const v = d.data() as Visit;
          pathMap.set(v.path, (pathMap.get(v.path) || 0) + 1);
        }
        setTopPages(
          [...pathMap.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([p, c]) => ({ path: p, count: c }))
        );
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Reveal><Card className="border-border/80">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Visits</p>
            <p className="mt-2 font-display text-3xl font-semibold">{totalVisits}</p>
          </CardContent>
        </Card></Reveal>
        <Reveal delay={80}><Card className="border-border/80">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Today</p>
            <p className="mt-2 font-display text-3xl font-semibold">{todayVisits}</p>
          </CardContent>
        </Card></Reveal>
        <Reveal delay={160}><Card className="border-border/80">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Last 7 Days</p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {dailyCounts.reduce((s, d) => s + d.count, 0)}
            </p>
          </CardContent>
        </Card></Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Reveal><Card className="border-border/80">
          <CardContent className="p-6">
            <h3 className="mb-5 font-semibold">Visits (Last 7 Days)</h3>
            <div className="flex h-32 items-end gap-2">
              {dailyCounts.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{d.count}</span>
                  <div
                    className="w-full rounded-t-md bg-primary transition-all"
                    style={{ height: `${Math.max((d.count / maxCount) * 100, 4)}%` }}
                  />
                  <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                    {d.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card></Reveal>

        <Reveal delay={100}><Card className="border-border/80">
          <CardContent className="p-6">
            <h3 className="mb-5 font-semibold">Top Pages</h3>
            <div className="space-y-3">
              {topPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between">
                  <span className="truncate text-sm text-foreground">{p.path || "/"}</span>
                  <span className="text-sm text-muted-foreground">
                    {p.count} visit{p.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
              {topPages.length === 0 && (
                <p className="text-sm text-muted-foreground">No data yet.</p>
              )}
            </div>
          </CardContent>
        </Card></Reveal>
      </div>
    </div>
  )
}