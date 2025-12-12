"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/_lib/firebase";
import { useAuth } from "@/app/_lib/AuthContext";

export default function ArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      setError("");
      try {
        const snapshot = await getDocs(collection(db, "tables"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(data);
      } catch (err) {
        setError("Nie udalo sie pobrac artykulow: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Protected
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Twoje tabele
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Lista dokumentow z kolekcji Firestore dostepnych dla zalogowanych uzytkownikow.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800/60">
          Wczytywanie tabel...
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800/60">
          Brak tabel przypisanych do tego konta.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60"
            >
              <TableCard table={article} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TableCard({ table }) {
  const headers = Array.isArray(table.headers) ? table.headers : [];
  const rows = Array.isArray(table.rows) ? table.rows : [];

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {table.title || "Bez tytulu"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ID: {table.id}
          </p>
        </div>
        {table.createdAt && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            {String(table.createdAt)}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:ring-slate-800/80">
        {headers.length > 0 ? (
          <div className="overflow-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {headers.map((h) => (
                    <th key={h.key || h.label} className="px-2 py-1 font-semibold">
                      {h.label || h.key || "Kolumna"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {rows.length > 0 ? (
                  rows.map((row, idx) => {
                    const cells = row?.cells || {};
                    return (
                      <tr key={row.id || idx} className="text-slate-700 dark:text-slate-200">
                        {headers.map((h) => (
                          <td key={h.key || h.label} className="px-2 py-1">
                            {formatCellValue(cells[h.key])}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="px-2 py-2 text-slate-500 dark:text-slate-400"
                      colSpan={headers.length || 1}
                    >
                      Brak wierszy w tej tabeli.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Brak zdefiniowanych kolumn (headers) w tym dokumencie.
          </p>
        )}
      </div>
    </div>
  );
}

function formatCellValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
