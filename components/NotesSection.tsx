
import React, { useState } from 'react';
import { FileText, Send } from 'lucide-react';
import { Note } from '../types';

interface NotesSectionProps {
  notes: Note[];
  onAddNote: (text: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleAdd = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote('');
    setIsFocused(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-slate-100 text-slate-800 flex items-center justify-center rounded-xl border border-slate-200">
          <FileText size={16} />
        </div>
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Contextual Notes</h3>
      </div>

      <div className="space-y-4">
        <div className={`
          relative bg-white border rounded-2xl transition-all duration-300 shadow-sm
          ${isFocused ? 'ring-4 ring-slate-900/5 border-slate-400' : 'border-slate-200'}
        `}>
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

        <div className="space-y-8 pt-2 relative before:absolute before:left-4 before:top-4 before:bottom-0 before:w-px before:bg-slate-100">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="relative pl-10 animate-in fade-in slide-in-from-left-2">
                <div className="absolute left-2.5 top-2 w-3 h-3 bg-white border-2 border-slate-800 rounded-full shadow-sm z-10" />
                <div className="space-y-1.5">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{note.text}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                    <span>{new Date(note.createdAtUtc).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <span className="mx-2 opacity-30">•</span>
                    <span>{new Date(note.createdAtUtc).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-10 py-2 text-xs text-slate-400 italic">No notes captured yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
