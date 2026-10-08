import React, { useState, useRef, useEffect } from "react";

const LANGUAGE_OPTIONS = [
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
  { code: "fa-IR", label: "Persian" },
  { code: "pa-IN", label: "Punjabi" },
  { code: "bn-IN", label: "Bengali" },
  { code: "th-TH", label: "Thai" },
  { code: "vi-VN", label: "Vietnamese" },
  { code: "pl-PL", label: "Polish" },
  { code: "id-ID", label: "Indonesian" },
];

interface VibeCustomizerProps {
  userPrompt: string;
  setUserPrompt: (val: string) => void;
  count: number;
  setCount: (val: number) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (val: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function VibeCustomizer({
  userPrompt,
  setUserPrompt,
  count,
  setCount,
  selectedLanguages,
  setSelectedLanguages,
  onSubmit,
  onReset,
  isLoading,
}: VibeCustomizerProps) {
  const hasUserInput = userPrompt.trim() !== "";
  const buttonLabel = hasUserInput ? "Generate Picks" : "Generate Random";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = (code: string) => {
    if (selectedLanguages.includes(code)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== code));
    } else {
      setSelectedLanguages([...selectedLanguages, code]);
    }
  };

  const removeLanguage = (code: string) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== code));
  };

  return (
    <section className="bg-zinc-900/40 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 md:p-6 shadow-xl sticky top-20">
      {/* Title */}
      <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4 pb-3 border-b border-zinc-900 select-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Customize Vibe
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Custom prompt input */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            What are you in the mood for?
          </label>
          <input
            type="text"
            maxLength={100}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="e.g., A rainy night mystery..."
            className="w-full bg-zinc-950/80 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-xs"
          />
        </div>

        {/* Languages (multi-select) */}
        <div className="space-y-1.5 relative" ref={dropdownRef}>
          <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
            Languages
          </label>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-zinc-950/80 border border-zinc-850 rounded-xl px-3.5 py-2 min-h-[44px] flex flex-wrap gap-1.5 items-center cursor-pointer focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all"
          >
            {selectedLanguages.length === 0 ? (
              <span className="text-xs text-zinc-500">Any language</span>
            ) : (
              selectedLanguages.map(code => {
                const lang = LANGUAGE_OPTIONS.find(l => l.code === code);
                return (
                  <span key={code} className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded-md font-medium">
                    {lang?.label || code}
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeLanguage(code); }}
                      className="text-zinc-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </span>
                )
              })
            )}
          </div>
          
          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl max-h-60 overflow-auto">
              <div className="p-1">
                {LANGUAGE_OPTIONS.map((language) => (
                  <div
                    key={language.code}
                    onClick={() => toggleLanguage(language.code)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg cursor-pointer transition-colors ${
                      selectedLanguages.includes(language.code) ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      selectedLanguages.includes(language.code) ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600'
                    }`}>
                      {selectedLanguages.includes(language.code) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    {language.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* Count Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
              Recommendations Count
            </label>
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {count} movies
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[9px] text-zinc-500 font-bold">
            <span>1 Movie</span>
            <span>10 Movies</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-all duration-205"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-zinc-900 disabled:to-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-emerald-500/15 transition-all duration-205 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                {buttonLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
