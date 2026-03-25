"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

const placeholders = [
  "Elegant gold and navy Malay wedding with floral motifs...",
  "Minimalist white and sage green garden wedding...",
  "Royal purple and gold traditional Nikah ceremony...",
  "Rustic outdoor wedding with earth tones and greenery...",
  "Modern black and white with calligraphy details...",
];

export function HeroPrompt() {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex] = useState(
    Math.floor(Math.random() * placeholders.length)
  );
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/create?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <div className="relative flex items-center bg-white border border-gray-200 rounded-full shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/50 transition-shadow">
        <Sparkles className="absolute left-4 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholders[placeholderIndex]}
          className="w-full pl-11 pr-28 py-4 text-sm bg-transparent rounded-full focus:outline-none placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="absolute right-2 inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full px-5 py-2.5 transition-colors"
        >
          Create
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Describe your dream wedding invitation and AI will design it for you
      </p>
    </form>
  );
}
