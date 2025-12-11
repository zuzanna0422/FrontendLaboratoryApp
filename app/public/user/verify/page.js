"use client";

import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "@/app/_lib/AuthContext";

export default function VerifyEmail() {
  const { user } = useAuth();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth);
  }, []);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
        Email niezweryfikowany
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Kliknij link w mailu wysłanym na adres {user?.email || "twoj email"} i potwierdź rejestrację.
        Po weryfikacji zaloguj się ponownie.
      </p>
    </div>
  );
}
