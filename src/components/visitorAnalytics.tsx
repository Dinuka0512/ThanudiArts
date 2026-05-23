import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc, getDoc, collection, getDocs, query,
  orderBy, limit
} from "firebase/firestore";

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
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const maxCount = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Total Visits</p>
          <p className="text-3xl font-bold">{totalVisits}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Today</p>
          <p className="text-3xl font-bold">{todayVisits}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Last 7 Days</p>
          <p className="text-3xl font-bold">{dailyCounts.reduce((s, d) => s + d.count, 0)}</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Visits (Last 7 Days)</h3>
        <div className="flex items-end gap-2 h-32">
          {dailyCounts.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400">{d.count}</span>
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${Math.max((d.count / maxCount) * 100, 4)}%`,
                  backgroundColor: d.count > 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.1)",
                }}
              />
              <span className="text-[10px] text-gray-500 whitespace-nowrap">
                {d.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
        <div className="space-y-2">
          {topPages.map((p) => (
            <div key={p.path} className="flex justify-between items-center">
              <span className="text-gray-300">{p.path || "/"}</span>
              <span className="text-sm text-gray-400">{p.count} visit{p.count !== 1 ? "s" : ""}</span>
            </div>
          ))}
          {topPages.length === 0 && <p className="text-gray-500 text-sm">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}
