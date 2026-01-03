import React, { useMemo, useState } from "react";
import { FileText, Send } from "lucide-react";
import { Note } from "../types";

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (text: string) => void;
  currentAuthorName?: string;
  currentAuthorAvatarUrl?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  currentAuthorName,
  currentAuthorAvatarUrl,
}) => {
  const [newNote, setNewNote] = useState("");

  const sortedNotes = useMemo(() => {
    return [...notes].sort(
      (a, b) =>
        new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
    );
  }, [notes]);

  const formatTimestamp = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;

    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatRelativeTime = (iso: string) => {
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    if (Number.isNaN(diffMs)) return "";

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 10) return "just now";
    if (diffSeconds < 60) return `${diffSeconds}s ago`;

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    return formatTimestamp(iso);
  };

  const getInitials = (name: string) => {
    const parts = name
      .split(" ")
      .map((p) => p.trim())
      .filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  };

  const handleAdd = () => {
    const trimmed = newNote.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNewNote("");
  };

  const composerName = currentAuthorName || "You";

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-slate-50 text-slate-600 flex items-center justify-center rounded-xl border border-slate-100">
          <FileText size={14} strokeWidth={2.5} />
        </div>
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Notes
        </h3>
        <span className="ml-1 inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide bg-slate-50 border border-slate-100 text-slate-500">
          {notes.length}
        </span>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          {currentAuthorAvatarUrl ? (
            <img
              src={currentAuthorAvatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black border border-slate-900 shadow-sm shrink-0">
              {getInitials(composerName)}
            </div>
          )}

          <div className="flex-1">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleAdd();
              }}
              placeholder="Write a note..."
              rows={2}
              className="w-full bg-white border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 resize-none placeholder-slate-300 leading-relaxed shadow-inner"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {newNote.trim().length > 0
                  ? "Ctrl/⌘ + Enter to post"
                  : "Add context for future you"}
              </span>
              <button
                type="button"
                disabled={!newNote.trim()}
                onClick={handleAdd}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all flex items-center gap-2 shadow-sm border disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 text-white border-slate-900 hover:bg-black active:scale-[0.98]"
              >
                <span>Post</span>
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {sortedNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            No notes yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((note) => {
            const authorName = note.authorName || "Unknown";
            const relativeTime = formatRelativeTime(note.createdAtUtc);

            return (
              <div
                key={note.id}
                className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {note.authorAvatarUrl ? (
                        <img
                          src={note.authorAvatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black border border-slate-900 shadow-sm shrink-0">
                          {getInitials(authorName)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-black text-slate-900 truncate">
                            {authorName}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                          {note.text}
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-xs text-slate-400 font-bold whitespace-nowrap"
                      title={formatTimestamp(note.createdAtUtc)}
                    >
                      {formatTimestamp(note.createdAtUtc)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotesSection;
