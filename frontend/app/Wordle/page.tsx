"use client";

import { useState } from "react";
import { generatePuzzle, Puzzle } from "./WordleEngine";
import WordleGame from "./WordleGame";
import WORDS_3 from "../Data/words3.json";
import WORDS_4 from "../Data/words4.json";
import WORDS_5 from "../Data/words5.json";

const ALL_WORDS = [...WORDS_3, ...WORDS_4, ...WORDS_5];

export default function WordlePage() {
  const [englishWord, setEnglishWord] = useState("");
  const [phonemeWord, setPhonemeWord] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [noOfGuess, setNoOfGuess] = useState("8");
  const [phonemeLength, setPhonemeLength] = useState<3 | 4 | 5>(3);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const handleEnglishWordChange = (val: string) => {
    setEnglishWord(val);
    const entry = ALL_WORDS.find((e) => e.word.toLowerCase() === val.toLowerCase());
    setPhonemeWord(entry ? entry.phonemes.join(" ") : "");
  };

  const handlePhonemeLengthChange = (len: 3 | 4 | 5) => {
    setPhonemeLength(len);
  };

  const handleGenerate = () => {
    const maxGuesses = Math.min(8, Math.max(1, parseInt(noOfGuess) || 8)); {/* max number of guess*/} 
    setPuzzle(generatePuzzle(phonemeLength, maxGuesses, showHints));
  };

  return (
    <>
      {puzzle && <WordleGame puzzle={puzzle} onClose={() => setPuzzle(null)} />}
      <div className="bg-[var(--page-bg)] text-[var(--page-text)] p-8">
      <div className="max-w-4xl mx-auto flex gap-10">
        {/* Left column */}
        <div className="flex flex-col gap-8 flex-1">
          {/* Phoneme Word output */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right shrink-0">Phoneme Word</label>
            <div className="border border-[var(--border)] rounded px-3 py-2 w-52 min-h-[40px] bg-transparent text-[var(--page-text)] font-mono">
              {phonemeWord}
            </div>
          </div>

          {/* English Word input */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right shrink-0">English Word</label>
            <input
              type="text"
              value={englishWord}
              onChange={(e) => handleEnglishWordChange(e.target.value)}
              className="border border-[var(--border)] rounded px-3 py-2 w-52 bg-transparent text-[var(--page-text)] outline-none focus:border-blue-400"
            />
          </div>

          {/* Show Hints radio */}
          <div className="flex items-center gap-4">
            <span className="w-40 text-right shrink-0">Show Hints</span>
            <div className="flex gap-6">
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="showHints"
                  checked={showHints === true}
                  onChange={() => setShowHints(true)}
                  className="w-6 h-6 accent-teal-400 cursor-pointer"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex flex-col items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="showHints"
                  checked={showHints === false}
                  onChange={() => setShowHints(false)}
                  className="w-6 h-6 accent-teal-400 cursor-pointer"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>

          {/* No of Guess input */}
          <div className="flex items-center gap-4">
            <label className="w-40 text-right shrink-0">No of Guess  (maximum 8) </label>
            <input
              type="number"
              min={1}
              max={8}
              value={noOfGuess}
              onChange={(e) => setNoOfGuess(e.target.value)}
              className="border border-[var(--border)] rounded px-3 py-2 w-52 bg-transparent text-[var(--page-text)] outline-none focus:border-blue-400"
            />
          </div>

          {/* Phoneme length selector */}
          <div className="flex items-center gap-4">
            <span className="w-40 text-right shrink-0">Phoneme Length</span>
            <div className="flex gap-6">
              {([3, 4, 5] as const).map((len) => (
                <label key={len} className="flex flex-col items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="phonemeLength"
                    checked={phonemeLength === len}
                    onChange={() => handlePhonemeLengthChange(len)}
                    className="w-6 h-6 accent-teal-400 cursor-pointer"
                  />
                  <span className="text-sm">{len}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              className="border border-[var(--border)] rounded px-10 py-3 text-[var(--page-text)] hover:bg-blue-600 hover:border-blue-600 transition-colors"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
