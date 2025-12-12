"use client";

import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/_lib/firebase";
import { useAuth } from "@/app/_lib/AuthContext";

function getInitials(displayName, email) {
  const source = displayName || email || "UA";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    street: "",
    city: "",
    zipCode: "",
  });
  const [error, setError] = useState("");
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    setIsAddressLoading(true);
    setError("");

    const loadAddress = async () => {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        street: "",
        city: "",
        zipCode: "",
      });

      try {
        const snapshot = await getDoc(doc(db, "users", user?.uid));
        const address = snapshot.data()?.address;
        if (address) {
          setFormData((prev) => ({
            ...prev,
            city: address.city || "",
            street: address.street || "",
            zipCode: address.zipCode || "",
          }));
        }
      } catch (err) {
        setError("Nie udalo sie pobrac adresu: " + err.message);
      } finally {
        setIsAddressLoading(false);
      }
    };

    loadAddress();
  }, [user]);

  if (!user) {
    return null;
  }

  const initials = getInitials(formData.displayName, formData.email);
  const isFormDisabled = isAddressLoading;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isAddressLoading) {
      return;
    }
    setError("");

    const data = formData;

    updateProfile(user, {
      displayName: data.displayName,
      photoURL: data.photoURL,
    })
      .then(() => {
        console.log("Profile updated");
      })
      .catch((error) => {
        setError(error.message);
      });

    setDoc(
      doc(db, "users", user?.uid),
      {
        address: {
          city: data.city,
          street: data.street,
          zipCode: data.zipCode,
        },
      },
      { merge: true }
    )
      .then(() => {
        console.log("Address saved");
      })
      .catch((error) => {
        setError("Brak praw do zapisu: " + error.message);
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

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-base font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
          {formData.photoURL ? (
            <img
              src={formData.photoURL}
              alt={formData.displayName || formData.email || "Avatar"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          {formData.photoURL
            ? "Podglad aktualnego zdjecia profilowego."
            : "Brak zdjecia. Dodaj link do avatara ponizej."}
        </div>
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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Twoja nazwa"
            disabled={isFormDisabled}
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
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="https://example.com/avatar.jpg"
            disabled={isFormDisabled}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block space-y-2 sm:col-span-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Ulica
            </span>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="ul. Przykladowa 1"
            disabled={isFormDisabled}
          />
        </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Miasto
            </span>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Warszawa"
            disabled={isFormDisabled}
          />
        </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Kod pocztowy
            </span>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={onChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="00-000"
            disabled={isFormDisabled}
          />
        </label>
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus:ring-slate-700"
          disabled={isFormDisabled}
        >
          Zapisz profil
        </button>
      </form>
    </div>
  );
}
