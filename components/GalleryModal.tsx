
import React, { useState } from 'react';
import { X, Camera, Film, Link, Type, AlignLeft, Send } from 'lucide-react';
import { Input, SectionHeading } from './UIPrimitives';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { type: 'image' | 'video', url: string, title: string, description: string }) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSave({ type, url, title, description });
    setUrl('');
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Camera size={20} />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Register Media</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Append to Visual Archive</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                type="button"
                onClick={() => setType('image')}
                className={`flex-1 py-2 flex items-center justify-center space-x-2 rounded-lg text-xs font-black uppercase transition-all ${type === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Camera size={14} />
                 <span>Photo</span>
               </button>
               <button 
                type="button"
                onClick={() => setType('video')}
                className={`flex-1 py-2 flex items-center justify-center space-x-2 rounded-lg text-xs font-black uppercase transition-all ${type === 'video' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Film size={14} />
                 <span>Video</span>
               </button>
            </div>

            <Input 
              autoFocus
              label="Source URL"
              icon={Link}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />

            <Input 
              label="Caption / Title"
              icon={Type}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Roof Inspection April 2024"
            />

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                 <AlignLeft size={10} className="mr-1.5" /> Description
               </label>
               <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional documentation context..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none shadow-inner"
               />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl transition-all active:scale-95"
            >
              Save to Archive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryModal;
