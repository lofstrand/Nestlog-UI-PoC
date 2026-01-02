
import React from 'react';
import { ChevronLeft, Edit2, Trash2 } from 'lucide-react';

interface DetailLayoutProps {
  title: string;
  typeLabel: string;
  description?: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}

const DetailLayout: React.FC<DetailLayoutProps> = ({ 
  title, typeLabel, description, onBack, onEdit, onDelete, children 
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-4">
          <button onClick={onBack} className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
            <ChevronLeft size={14} className="mr-1" />
            Back to list
          </button>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{title}</h1>
              <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">{typeLabel}</span>
            </div>
            <p className="text-slate-500 text-lg max-w-3xl font-medium leading-relaxed">{description || 'Detailed entry management.'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onEdit}
            className="flex items-center space-x-2 px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-bold shadow-sm active:scale-95"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          <button 
            onClick={onDelete}
            className="flex items-center space-x-2 px-6 py-2.5 bg-[#fdf3f0] text-[#b45c43] border border-[#f9dad3] hover:bg-[#f9dad3] rounded-xl transition-all text-sm font-bold active:scale-95"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DetailLayout;
