import React, { useState } from "react";
import { FileText, Send } from "lucide-react";
import { Note } from "../types";

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (text: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onAddNote }) => {
  const [newNote, setNewNote] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleAdd = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote("");
    setIsFocused(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-slate-100 text-slate-800 flex items-center justify-center rounded-xl border border-slate-200">
          <FileText size={16} />
        </div>
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Notes
        </h3>
      </div>

      <div className="space-y-4">
        <div
          className={`
          relative bg-white border rounded-2xl transition-all duration-300 shadow-sm
          ${
            isFocused
              ? "ring-4 ring-slate-900/5 border-slate-400"
              : "border-slate-200"
          }
        `}
        >
          <textarea
            value={newNote}
            // Fixed: Use e.target.value instead of target.value
            onChange={(e) => setNewNote(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Add a quick note..."
            rows={isFocused ? 3 : 1}
            className="w-full px-5 py-4 bg-transparent text-sm text-slate-900 focus:outline-none resize-none placeholder-slate-300 leading-relaxed transition-all"
          />
          {isFocused && (
            <div className="px-4 pb-3 flex justify-end animate-in fade-in slide-in-from-top-1">
              <button
                type="button"
                onClick={handleAdd}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center space-x-2 shadow-lg active:scale-95"
              >
                <span>Post Note</span>
                <Send size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6 pt-2">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="animate-in fade-in slide-in-from-bottom-1"
              >
                {/* Meta header */}
                <div className="mb-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>
                    {new Date(note.createdAtUtc).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="opacity-30">•</span>
                  <span>
                    {new Date(note.createdAtUtc).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Content block */}
                <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium max-w-prose">
                    {note.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
