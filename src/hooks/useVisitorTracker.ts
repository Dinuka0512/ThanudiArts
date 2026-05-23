import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";

function getDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function useVisitorTracker() {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    const path = location.pathname;
    if (path === lastPath.current) return;
    if (path.startsWith("/admin")) return;
    lastPath.current = path;

    const dateStr = getDateString();

    addDoc(collection(db, "visits"), {
      path,
      date: dateStr,
      timestamp: serverTimestamp(),
      referrer: document.referrer || "",
    }).catch(() => {});

    setDoc(doc(db, "stats", "visitors"), { total: increment(1) }, { merge: true }).catch(() => {});
    setDoc(doc(db, "dailyStats", dateStr), { count: increment(1), date: dateStr }, { merge: true }).catch(() => {});
  }, [location.pathname]);
}
