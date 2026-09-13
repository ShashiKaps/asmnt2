"use client";

import { useEffect, useState } from "react";
import {
  WordListEntry,
  fetchWordLists,
  createWordList,
  updateWordList,
  deleteWordList,
  addWordToList,
  updateWord,
  deleteWord,
} from "../lib/api";

export default function ActivityManager() {
  const [lists, setLists] = useState<WordListEntry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // create-new-list form
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLength, setNewLength] = useState<3 | 4 | 5>(3);

  // edit-selected-list form
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // add-word form
  const [newWord, setNewWord] = useState("");
  const [newPhonemes, setNewPhonemes] = useState("");

  // per-word inline edit state
  const [editingWordId, setEditingWordId] = useState<number | null>(null);
  const [editWordText, setEditWordText] = useState("");
  const [editPhonemesText, setEditPhonemesText] = useState("");

  const selected = lists.find((l) => l.id === selectedId) || null;

  const reload = () =>
    fetchWordLists()
      .then((data) => {
        setLists(data);
        setError("");
      })
      .catch((e) => setError(e.message || "Could not load activities."))
      .finally(() => setLoading(false));

  useEffect(() => {
    reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selected) {
      setEditName(selected.name);
      setEditDescription(selected.description || "");
    }
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateList = async () => {
    if (!newName.trim()) return;
    try {
      const created = await createWordList({ name: newName.trim(), description: newDescription.trim(), phonemeLength: newLength });
      setNewName("");
      setNewDescription("");
      await reload();
      setSelectedId(created.id);
    } catch (e: any) {
      setError(e.message || "Could not create activity.");
    }
  };

  const handleUpdateListMeta = async () => {
    if (!selected) return;
    try {
      await updateWordList(selected.id, { name: editName.trim(), description: editDescription.trim() });
      await reload();
    } catch (e: any) {
      setError(e.message || "Could not update activity.");
    }
  };

  const handleDeleteList = async () => {
    if (!selected) return;
    if (!confirm(`Delete activity "${selected.name}" and all its words?`)) return;
    try {
      await deleteWordList(selected.id);
      setSelectedId(null);
      await reload();
    } catch (e: any) {
      setError(e.message || "Could not delete activity.");
    }
  };

  const handleAddWord = async () => {
    if (!selected || !newWord.trim() || !newPhonemes.trim()) return;
    const phonemes = newPhonemes.trim().split(/\s+/);
    try {
      await addWordToList(selected.id, { word: newWord.trim(), phonemes });
      setNewWord("");
      setNewPhonemes("");
      await reload();
    } catch (e: any) {
      setError(e.message || "Could not add word.");
    }
  };

  const startEditWord = (id: number, word: string, phonemes: string[]) => {
    setEditingWordId(id);
    setEditWordText(word);
    setEditPhonemesText(phonemes.join(" "));
  };

  const handleSaveWord = async () => {
    if (editingWordId == null) return;
    try {
      await updateWord(editingWordId, { word: editWordText.trim(), phonemes: editPhonemesText.trim().split(/\s+/) });
      setEditingWordId(null);
      await reload();
    } catch (e: any) {
      setError(e.message || "Could not update word.");
    }
  };

  const handleDeleteWord = async (id: number) => {
    if (!confirm("Delete this word?")) return;
    try {
      await deleteWord(id);
      await reload();
    } catch (e: any) {
      setError(e.message || "Could not delete word.");
    }
  };

  return (
    <div className="border border-[var(--border)] rounded p-4 flex flex-col gap-4">
      <span className="font-semibold text-sm">Manage Activities (Word Lists)</span>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {loading ? (
        <p className="text-sm text-[var(--muted-text)]">Loading activities…</p>
      ) : (
        <div className="flex gap-6 flex-wrap">
          {/* List of activities */}
          <div className="flex flex-col gap-2 min-w-[220px]">
            <span className="text-xs text-[var(--muted-text)]">Activities</span>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {lists.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={`text-left text-sm px-3 py-2 rounded border transition-colors ${
                    selectedId === l.id
                      ? "border-blue-400 bg-[var(--chrome-bg)]"
                      : "border-[var(--border)] hover:bg-[var(--chrome-bg)]"
                  }`}
                >
                  {l.name} <span className="text-[var(--muted-text)]">({l.phonemeLength}p, {l.words.length} words)</span>
                </button>
              ))}
              {lists.length === 0 && <span className="text-sm text-[var(--muted-text)]">No activities yet.</span>}
            </div>

            {/* Create new activity */}
            <div className="flex flex-col gap-2 mt-3 border-t border-[var(--border)] pt-3">
              <span className="text-xs text-[var(--muted-text)]">New Activity</span>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-transparent"
              />
              <input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-transparent"
              />
              <div className="flex gap-3">
                {([3, 4, 5] as const).map((len) => (
                  <label key={len} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" checked={newLength === len} onChange={() => setNewLength(len)} className="accent-teal-400" />
                    {len}
                  </label>
                ))}
              </div>
              <button
                onClick={handleCreateList}
                className="py-1.5 px-3 border border-[var(--border)] rounded text-sm font-semibold hover:bg-[var(--chrome-bg)] text-blue-400"
              >
                + Create Activity
              </button>
            </div>
          </div>

          {/* Selected activity detail */}
          {selected && (
            <div className="flex-1 min-w-[280px] flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-transparent font-semibold"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateListMeta}
                    className="py-1 px-3 border border-[var(--border)] rounded text-sm hover:bg-[var(--chrome-bg)] text-blue-400"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleDeleteList}
                    className="py-1 px-3 border border-[var(--border)] rounded text-sm hover:bg-[var(--chrome-bg)] text-red-400"
                  >
                    Delete Activity
                  </button>
                </div>
              </div>

              {/* Words in this activity */}
              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto border-t border-[var(--border)] pt-2">
                {selected.words.map((w) => (
                  <div key={w.id} className="flex items-center gap-2 text-sm">
                    {editingWordId === w.id ? (
                      <>
                        <input
                          value={editWordText}
                          onChange={(e) => setEditWordText(e.target.value)}
                          className="border border-[var(--border)] rounded px-1 py-0.5 w-24 bg-transparent"
                        />
                        <input
                          value={editPhonemesText}
                          onChange={(e) => setEditPhonemesText(e.target.value)}
                          className="border border-[var(--border)] rounded px-1 py-0.5 flex-1 bg-transparent font-mono"
                        />
                        <button onClick={handleSaveWord} className="text-blue-400">Save</button>
                        <button onClick={() => setEditingWordId(null)} className="text-[var(--muted-text)]">Cancel</button>
                      </>
                    ) : (
                      <>
                        <span className="w-24 truncate">{w.word}</span>
                        <span className="flex-1 font-mono text-[var(--muted-text)]">{w.phonemes.join(" ")}</span>
                        <button onClick={() => startEditWord(w.id!, w.word, w.phonemes)} className="text-blue-400">Edit</button>
                        <button onClick={() => handleDeleteWord(w.id!)} className="text-red-400">Delete</button>
                      </>
                    )}
                  </div>
                ))}
                {selected.words.length === 0 && <span className="text-sm text-[var(--muted-text)]">No words yet.</span>}
              </div>

              {/* Add word to this activity */}
              <div className="flex gap-2 border-t border-[var(--border)] pt-2">
                <input
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="word"
                  className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-transparent w-24"
                />
                <input
                  value={newPhonemes}
                  onChange={(e) => setNewPhonemes(e.target.value)}
                  placeholder="phonemes e.g. b e d"
                  className="border border-[var(--border)] rounded px-2 py-1 text-sm bg-transparent flex-1 font-mono"
                />
                <button
                  onClick={handleAddWord}
                  className="py-1 px-3 border border-[var(--border)] rounded text-sm hover:bg-[var(--chrome-bg)] text-blue-400"
                >
                  + Add Word
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
