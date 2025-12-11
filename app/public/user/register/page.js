"use client";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Rejestracja
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Utworz konto, podajac adres email i haslo.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-4"
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Haslo
          </span>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
            placeholder="••••••••"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Powtorz haslo
          </span>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
        >
          Zarejestruj
        </button>
      </form>
    </div>
  );
}
