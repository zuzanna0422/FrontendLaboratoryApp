import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { label: "Panel", href: "/", Icon: HomeIcon },
  { label: "Profil", href: "/protected/user/profile", Icon: ProfileIcon },
  { label: "Zmien haslo", href: "/protected/user/changepassword", Icon: LockIcon },
  { label: "Wyloguj", href: "/protected/user/signout", Icon: LogoutIcon },
];

export const metadata = {
  title: "Laboratory App",
  description: "Uklad z nawigacja Mamba UI: sidebar, gorny pasek, stopka.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
          <div className="mx-auto grid min-h-screen max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:grid-cols-[260px_1fr]">
            <aside className="flex flex-col gap-6 bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-8 text-slate-50">
              <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-semibold text-slate-900 shadow-md">
                  UA
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
                    Nawigacja
                  </p>
                  <p className="text-xl font-bold">Panel uzytkownika</p>
                </div>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <SidebarLink key={item.href} {...item} />
                ))}
              </nav>
            </aside>

            <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
              <header className="flex flex-col gap-4 border-b border-slate-200/60 bg-white/80 px-8 py-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Laboratory App
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                    Staly uklad aplikacji
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pasek boczny, gorny pasek z poleceniami logowania oraz stopka ponizej.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/public/user/register"
                    className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500"
                  >
                    Rejestracja
                  </Link>
                  <Link
                    href="/public/user/signin"
                    className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                  >
                    Logowanie
                  </Link>
                </div>
              </header>

              <main className="flex-1 px-8 py-8">
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-6 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:ring-slate-800/60">
                  {children}
                </div>
              </main>

              <footer className="border-t border-slate-200 bg-white/90 px-8 py-4 text-sm text-slate-500 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-400">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span>(c) {new Date().getFullYear()} Laboratory App - stala nawigacja i stopka.</span>
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    Dostepne linki: rejestracja, logowanie, profil, wylogowanie.
                  </span>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

function SidebarLink({ href, label, Icon }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 shadow-sm transition hover:-translate-y-[1px] hover:border-white/15 hover:bg-white/10 hover:text-white"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/20 text-slate-100 ring-1 ring-white/10 transition group-hover:bg-white/15 group-hover:ring-white/20">
        <Icon />
      </span>
      <span>{label}</span>
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-5a3 3 0 0 0-6 0v5H5a1 1 0 0 1-1-1z"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 7a7 7 0 0 1 14 0"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 11V8a5 5 0 1 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Zm5 4v2"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 6V4.5A1.5 1.5 0 0 0 13.5 3h-7A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h7A1.5 1.5 0 0 0 15 19.5V18m0-4h-6m9-4 3 4-3 4"
      />
    </svg>
  );
}
