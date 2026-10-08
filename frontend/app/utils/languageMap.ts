import { LANGUAGE_OPTIONS } from "@movie-recommendation/shared";

export const TMDB_LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  fr: "French",
  de: "German",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  is: "Icelandic",
  nl: "Dutch",
  ru: "Russian",
  tr: "Turkish",
  ar: "Arabic",
  pa: "Punjabi",
  bn: "Bengali",
  fa: "Persian (Iranian)",
  th: "Thai",
  vi: "Vietnamese",
  pl: "Polish",
  id: "Indonesian",
};

export { LANGUAGE_OPTIONS };

export function getLanguageName(code: string): string {
  if (!code) return "";
  return TMDB_LANGUAGE_MAP[code.toLowerCase()] || code.toUpperCase();
}
