
import React, { useState, useEffect } from 'react';
import { Layers, Archive, ListFilter, AlignLeft, ArrowUpCircle, TreePine } from 'lucide-react';
import { Space, SpaceType, Document } from "@/types";
import { Modal } from "@/components/ui";

interface SpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Space>) => void;
  initialData?: Space | null;
  availableDocuments: Document[];
}

const SpaceModal: React.FC<SpaceModalProps> = ({ isOpen, onClose, onSave, initialData, availableDocuments }) => {
  const formId = "space-modal-form";
  const [name, setName] = useState('');
  const [spaceType, setSpaceType] = useState<SpaceType>(SpaceType.Unknown);
  const [level, setLevel] = useState<number>(0);
  const [isOutdoor, setIsOutdoor] = useState(false);
  const [notes, setNotes] = useState('');
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSpaceType(initialData.spaceType);
      setLevel(initialData.level || 0);
      setIsOutdoor(initialData.isOutdoor);
      setNotes(initialData.notes?.[0]?.text || '');
      setIsArchived(initialData.isArchived);
    } else {
      setName('');
      setSpaceType(SpaceType.Unknown);
      setLevel(0);
      setIsOutdoor(false);
      setNotes('');
      setIsArchived(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit ${name}` : "New Space"}
      icon={Layers}
      size="lg"
      primaryActionLabel={initialData ? "Update Space" : "Create Space"}
      primaryActionType="submit"
      formId={formId}
      footer={
        <button
          onClick={onClose}
          type="button"
          className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          Cancel
        </button>
      }
    >
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              name,
              spaceType,
              level,
              isOutdoor,
              notes: notes
                ? [
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      text: notes,
                      createdAtUtc: new Date().toISOString(),
                    },
                  ]
                : [],
              isArchived,
            });
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <Layers size={12} className="mr-1.5" /> Space Name
                </label>
                <input 
                  autoFocus
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Master Bedroom"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                    <ListFilter size={12} className="mr-1.5" /> Type
                  </label>
                  <select 
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value as SpaceType)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                  >
                    {Object.values(SpaceType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                    <ArrowUpCircle size={12} className="mr-1.5" /> Level
                  </label>
                  <input 
                    type="number" 
                    value={level}
                    onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center">
                  <AlignLeft size={12} className="mr-1.5" /> General Notes
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes about surfaces, lighting, or dimensions..."
                  rows={4}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm resize-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
                  <TreePine size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-none">Outdoor Zone</p>
                  <p className="text-[10px] text-gray-500 mt-1">Check if this space is outside the building.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsOutdoor(!isOutdoor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOutdoor ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOutdoor ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5 p-1.5 bg-gray-200 text-gray-600 rounded-md">
                  <Archive size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-none">Archived</p>
                  <p className="text-[10px] text-gray-500 mt-1">Hide this space from active view.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsArchived(!isArchived)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isArchived ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isArchived ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </form>
    </Modal>
  );
};

export default SpaceModal;
