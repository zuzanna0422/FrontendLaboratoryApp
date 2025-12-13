## Frontend Laboratory App

Next.js 16 aplikacja laboratoryjna z obsługą Firebase Auth, formularzem rejestracji/logowania oraz sekcją zamówień.

## Wersja live

- Vercel: https://frontend-laboratory-no9yds52n-zuzias-projects-eb30e661.vercel.app
- Testowe logowanie: email `zuzia.cholewa@gmail.com`, hasło `321zuzia123`

## Uruchomienie lokalne

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Uruchom dev server:
   ```bash
   npm run dev
   ```
3. Otwórz aplikację na `http://localhost:3000`.

## Build i produkcja

- Build: `npm run build`
- Start serwera produkcyjnego: `npm run start`

## Testy e2e (Playwright)

- Konfiguracja w `playwright.config.ts` startuje dev server automatycznie:
  ```bash
  npx playwright test
  ```

## Konfiguracja środowiskowa

- Klucze Firebase w `.env` (zmienne `NEXT_PUBLIC_*`), wymagane do uwierzytelniania i Firestore.
