"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/app/_lib/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    updateProfile(user, {
      displayName: formData.displayName,
      photoURL: formData.photoURL,
    })
      .then(() => {
        console.log("Profile updated");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Protected
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Profil
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Zmien nazwe wyswietlana i adres zdjecia profilowego.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Nazwa wyswietlana
          </span>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
            placeholder="Twoja nazwa"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-300 focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Adres zdjecia profilowego
          </span>
          <input
            type="url"
            name="photoURL"
            value={formData.photoURL}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700"
            placeholder="https://example.com/avatar.jpg"
          />
        </label>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
        >
          Zapisz profil
        </button>
      </form>
    </div>
  );
}
