export const LANGUAGE_OPTIONS = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ta-IN", label: "Tamil" },
  { code: "te-IN", label: "Telugu" },
  { code: "ml-IN", label: "Malayalam" },
  { code: "kn-IN", label: "Kannada" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "es-ES", label: "Spanish" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "zh-CN", label: "Chinese" },
  { code: "sv-SE", label: "Swedish" },
  { code: "no-NO", label: "Norwegian" },
  { code: "da-DK", label: "Danish" },
  { code: "fi-FI", label: "Finnish" },
  { code: "is-IS", label: "Icelandic" },
  { code: "nl-NL", label: "Dutch" },
  { code: "ru-RU", label: "Russian" },
  { code: "tr-TR", label: "Turkish" },
  { code: "ar-SA", label: "Arabic" },
  { code: "fa-IR", label: "Persian (Iranian)" },
  { code: "pa-IN", label: "Punjabi" },
  { code: "bn-IN", label: "Bengali" },
  { code: "th-TH", label: "Thai" },
  { code: "vi-VN", label: "Vietnamese" },
  { code: "pl-PL", label: "Polish" },
  { code: "id-ID", label: "Indonesian" },
].sort((a, b) => a.label.localeCompare(b.label));

export function getLanguageLabel(code: string): string | undefined {
  return LANGUAGE_OPTIONS.find((l) => l.code === code)?.label;
}

export const GENRE_OPTIONS = [
  "Thriller",
  "Action",
  "Comedy",
  "Adventure",
  "Drama",
  "Sci-fi",
  "Romance",
  "Horror",
  "Fantasy",
  "Mystery",
  "Crime",
  "Western",
] as const;

export const MOOD_OPTIONS = [
  "Relaxed",
  "Energetic",
  "Excited",
  "Joyful",
  "Calm",
  "Thoughtful",
] as const;

export const RANDOM_CONTEXTS = [
  "Suggest movie for a rainy night",
  "Movie for a cozy weekend afternoon",
  "Film to watch when you can't sleep",
  "Perfect movie for a road trip",
  "Something to lift your spirits after a bad day",
  "Movie for a date night at home",
  "Film to watch with friends on game night",
  "Comfort movie for when you're feeling sick",
  "Movie to inspire you before a big presentation",
  "Late night movie when everyone else is asleep",
] as const;

export const RANDOM_GENRES = [
  "thriller",
  "comedy",
  "drama",
  "sci-fi",
  "action",
  "romance",
  "horror",
  "fantasy",
  "mystery",
  "adventure",
] as const;

export const RANDOM_MOODS = [
  "relaxed",
  "energetic",
  "thoughtful",
  "joyful",
  "calm",
  "excited",
] as const;
