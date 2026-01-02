
import React, { useState, useEffect } from 'react';
import { X, Tags, Hash, AlignLeft, Palette } from 'lucide-react';
import { Tag } from '../types';
import { Input, SectionHeading } from './UIPrimitives';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Tag>) => void;
  initialData?: Tag | null;
}

const TAG_ICONS = [
  { name: 'Label', value: 'Tag' },
  { name: 'Critical', value: 'AlertCircle' },
  { name: 'Finance', value: 'DollarSign' },
  { name: 'Tool', value: 'Wrench' },
  { name: 'Calendar', value: 'Calendar' },
  { name: 'Document', value: 'FileText' },
  { name: 'User', value: 'User' },
  { name: 'Star', value: 'Star' }
];

const TagModal: React.FC<TagModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [colorHex, setColorHex] = useState('#1e293b');
  const [iconName, setIconName] = useState('Tag');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setColorHex(initialData.colorHex || '#1e293b');
      setIconName(initialData.iconName || 'Tag');
    } else {
      setName('');
      setDescription('');
      setColorHex('#1e293b');
      setIconName('Tag');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      colorHex,
      iconName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Tag' : 'Add New Tag'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Label Definition" icon={Tags} />
            <Input 
              autoFocus
              label="Tag Label"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Warranty"
              required
            />
            <Input 
              textarea
              label="Usage Guidelines"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain when this tag should be applied..."
              rows={3}
            />
          </div>

          <div className="space-y-6">
            <SectionHeading label="Visual Signature" icon={Palette} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Color Marker</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="color" 
                    value={colorHex} 
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer overflow-hidden p-0 bg-white"
                  />
                  <Input value={colorHex} onChange={(e) => setColorHex(e.target.value)} className="font-mono text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Symbolic Icon</label>
                <select 
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {TAG_ICONS.map(i => <option key={i.value} value={i.value}>{i.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Dismiss</button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95">
            {initialData ? 'Update Tag' : 'Save Tag'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagModal;
