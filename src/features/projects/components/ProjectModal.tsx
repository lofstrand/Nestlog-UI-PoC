
import React, { useState, useEffect } from 'react';
import { X, FolderOpen, AlignLeft, Calendar, DollarSign, ListFilter, Layout, User, TrendingUp, Check } from 'lucide-react';
import { Project, ProjectStatus, Space, Contact } from "@/types";
import { Input, SectionHeading } from "@/components/ui";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
  initialData?: Project | null;
  availableSpaces: Space[];
  availableContacts: Contact[];
}

const STATUS_OPTIONS = Object.values(ProjectStatus);

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, initialData, availableSpaces, availableContacts }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.Planned);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [actualCost, setActualCost] = useState<string>('');
  const [spaceIds, setSpaceIds] = useState<string[]>([]);
  const [assignedContactId, setAssignedContactId] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setStatus(initialData.status);
      setStartDate(initialData.startDate || '');
      setEndDate(initialData.endDate || '');
      setBudget(initialData.budget?.toString() || '');
      setActualCost(initialData.actualCost?.toString() || '');
      setSpaceIds(initialData.spaceIds || []);
      setAssignedContactId(initialData.assignedContactId || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus(ProjectStatus.Planned);
      setStartDate('');
      setEndDate('');
      setBudget('');
      setActualCost('');
      setSpaceIds([]);
      setAssignedContactId('');
    }
  }, [initialData, isOpen]);

  const toggleSpace = (id: string) => {
    setSpaceIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      budget: budget ? parseFloat(budget) : null,
      actualCost: actualCost ? parseFloat(actualCost) : null,
      spaceIds,
      assignedContactId: assignedContactId || null,
      updatedAtUtc: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Core Identity" icon={FolderOpen} />
            <Input 
              autoFocus
              label="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Floor Renovation"
              required
            />
            <Input 
              textarea
              label="Detailed Scope"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Primary objectives and milestones..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <SectionHeading label="Project Locations" icon={Layout} />
            <div className="flex flex-wrap gap-2">
              {availableSpaces.map(s => {
                const isActive = spaceIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSpace(s.id)}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center space-x-2
                      ${isActive 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}
                    `}
                  >
                    {isActive && <Check size={12} />}
                    <span>{s.name}</span>
                  </button>
                );
              })}
              {availableSpaces.length === 0 && (
                <p className="text-xs text-slate-400 italic">No spaces defined for this property.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <User size={10} className="mr-1.5" /> Lead Contractor
              </label>
              <select 
                value={assignedContactId}
                onChange={(e) => setAssignedContactId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                <option value="">Not Assigned</option>
                {availableContacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.surname}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Project Schedule" icon={Calendar} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Target Commencement" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input label="Estimated Completion" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Financial Oversight" icon={TrendingUp} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Allocated Budget"
                icon={DollarSign}
                type="number"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0.00"
              />
              <Input 
                label="Total Disbursed Cost"
                icon={DollarSign}
                type="number"
                step="0.01"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-8 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              {initialData ? 'Update Project' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
