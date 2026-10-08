export interface Helpline {
  service: string;
  number: string;
  si: string;
  ta: string;
}

// TODO: verify - Maintainers should re-verify these numbers regularly.
export const lastVerified = "2026-10-08";

export const helplines: Helpline[] = [
  { service: "Police Emergency", number: "119", si: "පොලිස් හදිසි සේවය", ta: "காவல்துறை அவசர சேவை" },
  { service: "National Women's Helpline", number: "1938", si: "ජාතික කාන්තා සහායක දුරකථනය", ta: "தேசிய பெண்கள் உதவி எண்" },
  { service: "Women In Need (WIN) Crisis Hotline", number: "0775676555", si: "කාන්තා අර්බුද ඇමතුම (WIN)", ta: "பெண்கள் நெருக்கடி உதவி (WIN)" },
  { service: "Mithuru Piyasa Support", number: "0702611111", si: "මිතුරු පියස", ta: "மித்துரு பியச" },
  { service: "Sumithrayo Emotional Support", number: "0112696666", si: "සුමිත්‍රයෝ", ta: "சுமித்ரயோ" },
  { service: "Suwa Seriya Ambulance", number: "1990", si: "සුව සැරිය ගිලන් රථ", ta: "சுவ செரிய ஆம்புலன்ஸ்" }
];
