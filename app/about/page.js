"use client";

export default function AboutPage() {
  const highlights = [
    { title: "Autor", content: "Zuzanna Cholewa — pasjonatka frontendu i dobrego UX." },
    { title: "Stos", content: "Next.js (app router), Firebase Auth/Firestore, Tailwind, MambaUI." },
    { title: "Funkcje", content: "Logowanie/rejestracja, profil z avatarem, artykuły, tabela zamówień z sortowaniem i ukrywaniem." },
    { title: "Temat", content: "Tabela zamówień z sortowaniem (3-stany) i collapse na rekordach zamówień." },
    { title: "Responsywnosc", content: "Widoki kart na mobile, tabela na desktop/tablet, elastyczny nagłówek i układ." },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          O aplikacji
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          O APLIKACJI
        </h1>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800/60">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Najważniejsze punkty</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-800 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-100"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                {item.title}
              </p>
              <p className="mt-2 leading-relaxed">{item.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-800/60">
        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Kontakt</h3>
        <p className="leading-relaxed">
          Masz pytania lub pomysły na nowe funkcje? Skontaktuj się mailowo:{" "}
          <a href="mailto:zuzia.cholewa@gmail.com" className="font-semibold text-slate-900 underline dark:text-white">
            zuzia.cholewa@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
