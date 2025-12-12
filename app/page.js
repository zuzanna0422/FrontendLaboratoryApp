"use client";

import { useEffect, useMemo, useState } from "react";
import { HEADERS } from "./data/orders";
import { addDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/app/_lib/firebase";

const COLLAPSE_STORAGE_KEY = "orders_collapsed_ids";

export default function Home() {
  const [sort, setSort] = useState({ key: null, direction: null });
  const [collapsedIds, setCollapsedIds] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    orderNo: "ZAM-",
    customer: "",
    total: "",
    status: "Nowe",
  });

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(COLLAPSE_STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCollapsedIds(parsed);
        }
      } catch (err) {
        console.warn("Cannot parse collapse state", err);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(collapsedIds));
  }, [collapsedIds]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const mapped = snapshot.docs.map((docSnap, index) => {
        const data = docSnap.data() || {};
        return {
          id: docSnap.id || data.orderNo || data.order_no || `row-${index}`,
          orderNo: data.orderNo || data.order_no || "N/A",
          customer: data.customer || "",
          total: Number(data.total ?? 0),
          status: data.status || "Nowe",
          originalIndex: index,
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Firestore fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchOrders().then(() => {
      if (!isMounted) return;
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedRows = useMemo(() => {
    const rowsCopy = [...rows];
    if (!sort.key || !sort.direction) {
      return rowsCopy;
    }
    return rowsCopy.sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (aVal === bVal) return 0;
      if (sort.direction === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  }, [rows, sort]);

  const viewRows = useMemo(() => {
    const collapsedSet = new Set(collapsedIds);
    const result = [];
    let i = 0;
    while (i < sortedRows.length) {
      if (!collapsedSet.has(sortedRows[i].id)) {
        result.push({ type: "row", row: sortedRows[i] });
        i += 1;
        continue;
      }
      const start = i;
      while (i < sortedRows.length && collapsedSet.has(sortedRows[i].id)) {
        i += 1;
      }
      const group = sortedRows.slice(start, i);
      result.push({ type: "collapsed", ids: group.map((r) => r.id), group });
    }
    return result;
  }, [sortedRows, collapsedIds]);

  const cycleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: null, direction: null };
      return { key, direction: "asc" };
    });
  };

  const totalVisibleSum = useMemo(() => {
    const hidden = new Set(collapsedIds);
    return rows.reduce(
      (sum, row) => (hidden.has(row.id) ? sum : sum + Number(row.total || 0)),
      0
    );
  }, [rows, collapsedIds]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "orderNo") {
      const trimmed = value.trim().replace(/^ZAM-?/i, "");
      setFormData((prev) => ({ ...prev, orderNo: `ZAM-${trimmed}` }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setFormError("");
    const orderNo = formData.orderNo.trim();
    const customer = formData.customer.trim();
    const total = formData.total;
    if (!orderNo || !customer || !total) {
      setFormError("Uzupelnij orderNo, customer i total.");
      return;
    }
    setFormSaving(true);
    try {
      const existingSnap = await getDocs(
        query(collection(db, "orders"), where("orderNo", "==", orderNo), limit(1))
      );
      if (!existingSnap.empty) {
        setFormError("Zamowienie z takim numerem juz istnieje.");
        setFormSaving(false);
        return;
      }

      await addDoc(collection(db, "orders"), {
        orderNo,
        customer,
        total: Number(total),
        status: formData.status || "Nowe",
      });
      setFormData({ orderNo: "ZAM-", customer: "", total: "", status: "Nowe" });
      setIsFormOpen(false);
      await fetchOrders();
    } catch (err) {
      setFormError(err.message || "Nie udalo sie zapisac zamowienia.");
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 sm:px-6 lg:px-0">
      <header className="space-y-1 text-center sm:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
          Zamowienia – tabela z sortowaniem i collapse
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sortuj po kolumnach (3-stany), ukrywaj zaznaczone wiersze i przywracaj grupy jednym kliknieciem.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setIsFormOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
          >
            {isFormOpen ? "Zamknij formularz" : "Dodaj zamowienie"}
          </button>
          {loading && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Ladowanie danych...
            </span>
          )}
        </div>
      </header>

      {isFormOpen && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
          <form onSubmit={submitOrder} className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Nr zamowienia</span>
              <input
                type="text"
                name="orderNo"
                value={formData.orderNo}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
                placeholder="ZAM-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Klient</span>
              <input
                type="text"
                name="customer"
                value={formData.customer}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
                placeholder="ACME"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Kwota</span>
              <input
                type="number"
                step="0.01"
                name="total"
                value={formData.total}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
                placeholder="199.90"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
              >
                <option>Nowe</option>
                <option>W realizacji</option>
                <option>Zrealizowane</option>
                <option>Anulowane</option>
              </select>
            </label>
            {formError && (
              <div className="sm:col-span-2 text-sm text-red-600 dark:text-red-300">
                {formError}
              </div>
            )}
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={formSaving}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-[1px] hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus:ring-emerald-700"
              >
                {formSaving ? "Zapisywanie..." : "Zapisz zamowienie"}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:focus:ring-slate-700"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
        <div className="sm:hidden">
          <div className="space-y-3">
            {viewRows.map((entry) => {
              if (entry.type === "row") {
                const row = entry.row;
                return (
                  <div
                    key={row.id}
                    className="rounded-xl border border-slate-200/70 bg-white/90 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {row.orderNo}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {row.customer}
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {row.total.toFixed(2)} zł
                        </p>
                        <StatusPill status={row.status} />
                      </div>
                      <button
                        onClick={() => setCollapsedIds((prev) => [...new Set([...prev, row.id])])}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                      >
                        Ukryj
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={entry.ids.join("-")}
                  className="rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                >
                  <div className="space-y-3 text-center">
                    <div className="text-sm">
                      Ukryto {entry.ids.length} wiersz(e): {entry.group.map((r) => r.orderNo).join(", ")}
                    </div>
                    <button
                      onClick={() =>
                        setCollapsedIds((prev) => prev.filter((id) => !entry.ids.includes(id)))
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900 sm:text-xs"
                    >
                      Pokaz
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="rounded-xl border border-slate-200/70 bg-slate-50 p-4 text-sm font-semibold text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-white">
              Suma: {totalVisibleSum.toFixed(2)} zł
            </div>
          </div>
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[680px] border-collapse text-xs sm:text-sm lg:min-w-full">
            <thead className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="w-24 px-3 py-3 text-left sm:w-20 sm:px-4">Akcja</th>
                {HEADERS.map((header) => (
                  <th key={header.key} className="px-3 py-3 text-left font-semibold sm:px-4">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{header.label}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => cycleSort(header.key)}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-700 transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800 sm:text-[11px]"
                        >
                          {sort.key === header.key
                            ? sort.direction === "asc"
                              ? "▲"
                              : sort.direction === "desc"
                                ? "▼"
                                : "⇅"
                            : "⇅"}
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {viewRows.map((entry, idx) => {
                if (entry.type === "row") {
                  const row = entry.row;
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <td className="px-3 py-3 align-middle sm:px-4">
                        <button
                          onClick={() => setCollapsedIds((prev) => [...new Set([...prev, row.id])])}
                          className="w-full rounded-lg border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800 sm:w-auto sm:text-xs"
                        >
                          Ukryj
                        </button>
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white sm:px-4">
                        {row.orderNo}
                      </td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-200 sm:px-4">
                        {row.customer}
                      </td>
                      <td className="px-3 py-3 text-slate-700 dark:text-slate-200 sm:px-4">
                        {row.total.toFixed(2)} zł
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <StatusPill status={row.status} />
                      </td>
                    </tr>
                  );
                }

                const labels = entry.group.map((r) => r.orderNo).join(", ");
                return (
                  <tr key={`collapsed-${idx}`} className="bg-slate-50 dark:bg-slate-800/60">
                    <td className="px-3 py-3 text-center text-slate-500 dark:text-slate-300 sm:px-4" colSpan={HEADERS.length + 1}>
                      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <span className="text-sm text-center">
                          Ukryto {entry.ids.length} wiersz(e): {labels}
                        </span>
                        <button
                          onClick={() =>
                            setCollapsedIds((prev) => prev.filter((id) => !entry.ids.includes(id)))
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-800 transition hover:-translate-y-[1px] hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900 sm:text-xs"
                        >
                          Pokaz
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-3 py-3 font-semibold sm:px-4">Suma</td>
                <td colSpan={HEADERS.length - 2}></td>
                <td className="px-3 py-3 font-semibold sm:px-4">{totalVisibleSum.toFixed(2)} zł</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const variant = getStatusVariant(status);
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${variant}`}
    >
      {status}
    </span>
  );
}

function getStatusVariant(status) {
  const map = {
    Nowe: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    "W realizacji": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    Zrealizowane: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    Anulowane: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  };
  return map[status] || "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
}
