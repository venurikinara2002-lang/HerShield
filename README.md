# HerShield (Safe Haven)

HerShield is a trauma-informed, privacy-first, offline-ready Progressive Web App (PWA) designed to support women in Sri Lanka experiencing emotional, psychological, and domestic abuse. 

## Core Features
1. **Security & Privacy:** The app prioritizes safety. Data is encrypted entirely on the device using PBKDF2-SHA256 and AES-256-GCM encryption. There is no remote logging, no analytics, and no cloud backups.
2. **Offline-First:** Built as a PWA, it functions seamlessly without an active internet connection after initial load.
3. **Emergency Directory:** One-tap emergency contacts in English, Sinhala, and Tamil. 
4. **Encrypted Incident Log:** A secure local log for recording incidents, behaviors, and uploading encrypted evidence (voice notes, photos).
5. **Timeline & PDF Reports:** A reverse-chronological feed of logs, with the ability to generate a formal "Official Incident Documentation Record" in PDF format.
6. **Hope & Affirmations:** Daily rotating, trauma-informed affirmations.
7. **Legal Guide:** Plain-language summaries of Sri Lankan domestic violence laws, legal aid resources, and actionable steps.
8. **Stealth Mode & Quick Exit:** A "Quick Exit" button instantly navigates to a safe site (or Open-Meteo weather). Stealth mode disguises the app as a "Daily Routine & Habit Journal".

## Technology Stack
- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS, lucide-react
- **Internationalization:** `react-i18next` (English, Sinhala, Tamil)
- **PWA:** `vite-plugin-pwa` (Workbox)
- **Crypto & Storage:** Web Crypto API, IndexedDB (`idb`)
- **Testing:** Vitest, React Testing Library, Playwright

## How to run the app right now
The development server is currently running in the background of your IDE.
1. Open your web browser on this computer.
2. Go to **[http://localhost:5173](http://localhost:5173)** to see and use the app.
3. To view it on your phone: Ensure your phone is on the same Wi-Fi network and navigate to the IP address of your computer (e.g., `http://192.168.x.x:5173`).

*(TODO: Add detailed threat model, deploy steps, and translation verification notes)*
