<div align="center">
  <img src="https://img.shields.io/badge/Status-Active_Development-E06287?style=for-the-badge&logo=shield" alt="Status"/>
  <img src="https://img.shields.io/badge/Security-Offline_First-E06287?style=for-the-badge&logo=lock" alt="Security"/>
  <img src="https://img.shields.io/badge/Encryption-AES_256_GCM-E06287?style=for-the-badge&logo=key" alt="Encryption"/>
</div>

<br/>

<h1 align="center" style="color: #E06287;">🛡️ HerShield</h1>

<p align="center">
  <b>A highly secure, offline-first domestic safety application designed for discretion, rapid exit, and encrypted evidence gathering.</b>
</p>

<p align="center">
  <i>"When she is ready to speak, HerShield ensures she has the evidence."</i>
</p>

---

<h2 style="color: #E06287;">🔒 Core Philosophy</h2>
<b>Safety over everything.</b> A woman using this app may be monitored. HerShield is built on the strict principle of zero remote storage, zero tracking, and absolute data privacy. All data generated on this app stays encrypted strictly on the local device, accessible only via the user's PIN.

---

<h2 style="color: #E06287;">✨ Dynamic Feature Set</h2>

### 1. 📓 AES-256-GCM Encrypted Evidence Vault
- **Zero Cloud Storage**: All logs (dates, behaviors, descriptions) are encrypted using AES-256-GCM and stored locally via `IndexedDB`.
- **Absolute Privacy**: Not even the developers can read this data. There are no cookies, trackers, or analytics.

### 2. 🚨 Emergency Stealth SOS Network
- **Mass Panic Alert**: Instantly trigger a group SMS to an entire offline network of trusted contacts with one tap.
- **Granular Customization**: Individual contact cards feature customized message templates (e.g., "Call me with a fake emergency") to send via WhatsApp or SMS.
- **Urgency Prefix**: All SOS communications are auto-prefixed with `[HerShield SOS]` to immediately flag priority.

### 3. 💥 Panic Wipe & Auto-Backup
- **Instant Erase**: If the device is compromised, hitting the "Erase Vault" button instantly obliterates the local database.
- **Auto-Backup**: Right before the wipe, the app silently generates an AES-encrypted `.enc` file (requiring the PIN to decrypt) and downloads it to the device, saving her months of hard work so it can be restored later when safe.

### 4. 📄 Official Evidence PDF Generator
- Converts the encrypted timeline into a highly professional, formatted PDF report.
- Stamped with timestamps and confidential legal headers.
- Ready to be printed and handed directly to legal counsel or law enforcement officers to establish a chain of evidence.

### 5. 🥷 Stealth Mode & Quick Exit
- **Visual Disguise**: Toggling Stealth Mode disguises the application interface as a generic "Habit Journal" to evade detection. Double-tap the invisible header to unlock.
- **Quick Exit**: A persistent escape button instantly clears memory and redirects the browser to a harmless, pre-configured website.
- **Auto-Locking**: The app purges decryption keys and locks down after 3 minutes of inactivity.

### 6. 🌍 Trilingual Localization
- Full `react-i18next` integration allows instant, seamless switching between **English, Sinhala, and Tamil**.
- Breaking language barriers to maximize accessibility across all demographics in Sri Lanka.

### 7. ⚖️ Localized Legal Guide
- Integrated legal directives detailing the *Prevention of Domestic Violence Act* and the *Penal Code*.
- Provides fast-dial contacts for the Legal Aid Commission, Police, and Women's Bureaus.

---

<h2 style="color: #E06287;">🛠️ Tech Stack</h2>
<table>
  <tr>
    <td align="center"><b>Framework</b></td>
    <td>React 19 + Vite</td>
  </tr>
  <tr>
    <td align="center"><b>Styling</b></td>
    <td>Tailwind CSS (v3) + Lucide Icons</td>
  </tr>
  <tr>
    <td align="center"><b>Cryptography</b></td>
    <td>Web Crypto API (AES-GCM, PBKDF2)</td>
  </tr>
  <tr>
    <td align="center"><b>Database</b></td>
    <td>IndexedDB (`idb`)</td>
  </tr>
  <tr>
    <td align="center"><b>Localization</b></td>
    <td>`i18next` & `react-i18next`</td>
  </tr>
  <tr>
    <td align="center"><b>Document Gen</b></td>
    <td>`jsPDF` & `jspdf-autotable`</td>
  </tr>
</table>

---

<h2 style="color: #E06287;">🚀 Getting Started (Local Deployment)</h2>

Because of its offline-first architecture, HerShield runs perfectly in local environments or as a Progressive Web App (PWA).

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/hershield.git

# 2. Navigate to directory
cd hershield

# 3. Install dependencies
npm install

# 4. Run the secure local server
npm run dev
```

---
<p align="center">
  <img src="https://img.shields.io/badge/Made_With-Care_&_Security-E06287?style=flat-square" alt="Made With Care"/>
</p>
