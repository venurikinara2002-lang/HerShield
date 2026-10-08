<div align="center">
  <img src="https://img.shields.io/badge/Security-Offline_First-E06287?style=for-the-badge&logo=shield" alt="Security"/>
  <img src="https://img.shields.io/badge/Encryption-AES_256_GCM-E06287?style=for-the-badge&logo=lock" alt="Encryption"/>
  <img src="https://img.shields.io/badge/Privacy-No_Tracking-E06287?style=for-the-badge&logo=eye-off" alt="Privacy"/>
</div>

<h1 align="center">🛡️ HerShield</h1>

<p align="center">
  <b>A highly secure, offline-first domestic safety application designed for discretion, rapid exit, and encrypted evidence gathering.</b>
</p>

---

## 🔒 Core Philosophy
**Safety over everything.** A woman using this app may be monitored. HerShield is built on the strict principle of zero remote storage, zero tracking, and absolute data privacy. All data generated on this app stays encrypted strictly on the local device.

## ✨ Key Features

### 1. 🛑 Emergency SOS Network
- **Granular Control**: Add and manage an offline network of trusted contacts.
- **Panic Button**: Instantly trigger a mass emergency SMS to your entire network with one tap.
- **Individual Comms**: Send customized WhatsApp or SMS alerts to specific contacts with pre-written templates (e.g., "Call me with a fake emergency").
- *All communications are securely prefixed with `[HerShield SOS]` to immediately notify the recipient of the urgency.*

### 2. 📓 Encrypted Evidence Vault
- **Encrypted Logs**: Record dates, times, behaviors (Gaslighting, Threats, Physical intimidation, etc.), and personal descriptions of incidents.
- **Military Grade Security**: Logs are encrypted using AES-256-GCM and a user-defined PIN. Not even the app developers can read this data.
- **Offline Storage**: Uses `IndexedDB` to ensure evidence never touches the internet.

### 3. 📄 Official PDF Generation
- Instantly convert your encrypted incident logs into a highly professional, formatted PDF report.
- Ready to be handed directly to law enforcement or legal counsel.
- Documents are stamped with timestamps and confidential legal headers.

### 4. 🥷 Stealth & Privacy Mechanisms
- **Stealth Mode**: Disguises the application interface as a generic "Habit Journal" to evade detection by an abuser. Double-tap the invisible header to reveal the true app.
- **Quick Exit (Panic Mode)**: A permanent, floating escape button (or double-tapping `ESC`) that instantly clears the app state and redirects the browser to a harmless pre-configured website (like a weather site).
- **Auto-Lock**: App automatically purges the decryption key from memory and locks down after 3 minutes of inactivity.
- **No Forgot Password**: To protect against forced resets, there is no email/SMS password recovery. The PIN is the only key.

### 5. 🌍 Multi-lingual Support
- Full i18n support offering instant toggling between **English, Sinhala, and Tamil**.
- Essential for accessibility across all demographics in Sri Lanka.

### 6. ⚖️ Localized Legal & Support Guidelines
- Integrated Sri Lankan legal guides detailing the Prevention of Domestic Violence Act, Maintenance Act, and Penal Code.
- Direct links and hotlines for the Legal Aid Commission, Sri Lanka Police, and Women's Bureaus.

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v3) + Lucide Icons
- **Cryptography**: Web Crypto API (AES-GCM, PBKDF2)
- **Database**: IndexedDB (`idb`)
- **Localization**: `i18next` & `react-i18next`
- **Export**: `jsPDF` & `jspdf-autotable`

---

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Run the local dev server**: `npm run dev`
4. **Deploy**: The app is designed to be fully static and installable as a PWA.

> *"When she is ready to speak, HerShield ensures she has the evidence."*
