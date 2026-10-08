import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Help": "Help",
      "Log": "Log",
      "Timeline": "Timeline",
      "Hope": "Hope",
      "Law": "Law",
      "Settings": "Settings",
      "QUICK EXIT": "QUICK EXIT",
      "Welcome": "Welcome to HerShield",
      "EnterPin": "Enter your PIN to unlock or continue without encryption.",
      "Unlock": "Unlock",
      "ContinueWithoutPin": "Continue without PIN (Not Encrypted)"
    }
  },
  si: {
    translation: {
      "Help": "උදව්",
      "Log": "සටහන",
      "Timeline": "කාලරේඛාව",
      "Hope": "බලාපොරොත්තුව",
      "Law": "නීතිය",
      "Settings": "සැකසුම්",
      "QUICK EXIT": "ඉක්මන් පිටවීම",
      "Welcome": "HerShield වෙත සාදරයෙන් පිළිගනිමු",
      "EnterPin": "අගුලු හැරීමට ඔබේ PIN අංකය ඇතුළත් කරන්න",
      "Unlock": "අගුලු හරින්න",
      "ContinueWithoutPin": "PIN නොමැතිව ඉදිරියට යන්න"
    }
  },
  ta: {
    translation: {
      "Help": "உதவி",
      "Log": "பதிவு",
      "Timeline": "காலவரிசை",
      "Hope": "நம்பிக்கை",
      "Law": "சட்டம்",
      "Settings": "அமைப்புகள்",
      "QUICK EXIT": "விரைவான வெளியேற்றம்",
      "Welcome": "HerShield க்கு வரவேற்கிறோம்",
      "EnterPin": "திறக்க உங்கள் PIN ஐ உள்ளிடவும்",
      "Unlock": "திறக்கவும்",
      "ContinueWithoutPin": "PIN இல்லாமல் தொடரவும்"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('hershield-lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
