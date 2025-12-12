"use client";

import { useAuth } from "@/app/_lib/AuthContext";

function getInitials(user) {
  const source = user?.displayName || user?.email || "UA";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserBadge() {
  const { user } = useAuth();
  const initials = getInitials(user);

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-lg font-semibold text-slate-900 shadow-md ring-2 ring-slate-200/70 dark:ring-white/10">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || user.email || "Uzytkownik"}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="leading-tight">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
          Nawigacja
        </p>
        <p className="text-xl font-bold">
          {user?.displayName || "Panel uzytkownika"}
        </p>
        <p className="text-xs text-slate-300 break-all">
          {user?.email || "Brak zalogowanego uzytkownika"}
        </p>
      </div>
    </div>
  );
}
