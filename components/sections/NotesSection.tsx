import React, { useMemo, useState } from "react";
import { FileText, Send, X, Pencil, Trash2, Check } from "lucide-react";
import { Note } from "../../types";

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (text: string) => void;
  onUpdateNote?: (noteId: string, text: string) => void;
  onDeleteNote?: (noteId: string) => void;
  currentAuthorName?: string;
  currentAuthorAvatarUrl?: string;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  currentAuthorName,
  currentAuthorAvatarUrl,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) =>
          new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime()
      ),
    [notes]
  );

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
    setIsAdding(false);
  };

  const startEdit = (note: Note) => {
    if (!onUpdateNote) return;
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setEditingText("");
  };

  const saveEdit = () => {
    if (!onUpdateNote || !editingNoteId) return;
    const trimmed = editingText.trim();
    if (!trimmed) return;
    onUpdateNote(editingNoteId, trimmed);
    cancelEdit();
  };

  const composerName = currentAuthorName || "You";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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

        {isAdding ? (
          <button
            onClick={() => {
              setIsAdding(false);
              setNewNote("");
            }}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight bg-white border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <X size={12} className="mr-1.5" /> Cancel
          </button>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight bg-white border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <Send size={12} className="mr-1.5" /> Add note
          </button>
        )}
      </div>

      {isAdding && (
        <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-white p-3 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="flex items-start gap-3">
            {currentAuthorAvatarUrl ? (
              <img
                src={currentAuthorAvatarUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover border border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-black border border-slate-900 shadow-sm shrink-0">
                {getInitials(composerName)}
              </div>
            )}

            <div className="flex-1">
              <textarea
                autoFocus
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleAdd();
                  if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewNote("");
                  }
                }}
                onBlur={() => {
                  if (!newNote.trim()) setIsAdding(false);
                }}
                placeholder="Add a note..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 resize-none placeholder-slate-300 leading-relaxed shadow-inner"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Ctrl/Cmd + Enter
                </span>
                <button
                  type="button"
                  disabled={!newNote.trim()}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleAdd}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all flex items-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 text-white border-slate-900 hover:bg-black active:scale-[0.98]"
                >
                  <span>Post</span>
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sortedNotes.length === 0 ? (
        <div className="py-5 px-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 bg-gray-50/20">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            No Notes
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotes.map((note) => {
            const authorName = note.authorName || "Unknown";
            const relativeTime = formatRelativeTime(note.createdAtUtc);
            const isEditing = editingNoteId === note.id;

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
                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              autoFocus
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if ((e.ctrlKey || e.metaKey) && e.key === "Enter")
                                  saveEdit();
                                if (e.key === "Escape") cancelEdit();
                              }}
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 resize-none placeholder-slate-300 leading-relaxed shadow-inner"
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Ctrl/Cmd + Enter
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={!editingText.trim()}
                                  onClick={saveEdit}
                                  className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all flex items-center gap-2 border disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900 text-white border-slate-900 hover:bg-black active:scale-[0.98]"
                                >
                                  <Check size={12} />
                                  <span>Save</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                            {note.text}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isEditing && onUpdateNote && (
                        <button
                          type="button"
                          onClick={() => startEdit(note)}
                          className="p-1.5 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      {!isEditing && onDeleteNote && (
                        <button
                          type="button"
                          onClick={() => onDeleteNote(note.id)}
                          className="p-1.5 rounded-xl text-slate-300 hover:text-[#b45c43] hover:bg-[#fdf3f0] border border-transparent hover:border-[#f9dad3] transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <span
                        className="text-xs text-slate-400 font-bold whitespace-nowrap"
                        title={formatTimestamp(note.createdAtUtc)}
                      >
                        {relativeTime}
                      </span>
                    </div>
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
