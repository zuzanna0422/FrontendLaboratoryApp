"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/app/_lib/firebase";

export default function LogoutForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      setErrorMessage(error.message || "Nie udalo sie wylogowac.");
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Wylogowanie
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Potwierdz, aby zakonczyc sesje.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
        >
          Wyloguj
        </button>
      </form>
    </div>
  );
}
