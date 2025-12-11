import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-2xl ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
          Nie znaleziono tej sciezki
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sprawdz adres lub wroc na strone glowna, aby kontynuowac korzystanie z aplikacji.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
          >
            Wroc do strony domowej
          </Link>
        </div>
      </div>
    </div>
  );
}
