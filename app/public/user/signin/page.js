"use client";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  signOut,
} from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();
  const returnUrl = params.get("returnUrl");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const email = e.target["email"]?.value || "";
    const password = e.target["password"]?.value || "";

    try {
      await setPersistence(auth, browserSessionPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, password);

      if (!credential.user.emailVerified) {
        setErrorMessage("Email niezweryfikowany. Sprawdz skrzynke i kliknij link weryfikacyjny.");
        await signOut(auth);
        router.push("/public/user/verify");
        return;
      }

      if (!returnUrl) {
        router.push("/");
        return;
      }
      router.push(returnUrl);
    } catch (error) {
      setErrorMessage(error.message || "Nie udalo sie zalogowac.");
    }
  };
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Logowanie
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Zaloguj sie, podajac adres email i haslo.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
            placeholder="********"
          />
        </label>

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
        >
          Zaloguj
        </button>
      </form>
    </div>
  );
}
