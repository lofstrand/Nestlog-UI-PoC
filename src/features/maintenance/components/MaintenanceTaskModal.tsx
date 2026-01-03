
import React, { useState, useEffect } from 'react';
import { X, Wrench, Calendar, Clock, AlertTriangle, Tag, MessageSquare, Plus, Trash2, Info, Layout, DollarSign, User, Repeat, Check, Box, CheckCircle } from 'lucide-react';
import { MaintenanceTask, MaintenanceTaskPriority, MaintenanceTaskStatus, Space, Contact, MaintenanceRecurrenceFrequency, InventoryItem } from "@/types";
import { Input, SectionHeading } from "@/components/ui";

interface MaintenanceTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<MaintenanceTask>) => void;
  initialData?: MaintenanceTask | null;
  availableSpaces: Space[];
  availableContacts: Contact[];
  availableInventory: InventoryItem[];
}

const PRIORITY_OPTIONS = Object.values(MaintenanceTaskPriority);
const STATUS_OPTIONS = Object.values(MaintenanceTaskStatus);
const RECURRENCE_OPTIONS = Object.values(MaintenanceRecurrenceFrequency);

const MaintenanceTaskModal: React.FC<MaintenanceTaskModalProps> = ({ isOpen, onClose, onSave, initialData, availableSpaces, availableContacts, availableInventory }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [spaceIds, setSpaceIds] = useState<string[]>([]);
  const [assignedContactId, setAssignedContactId] = useState<string>('');
  const [requiredInventoryIds, setRequiredInventoryIds] = useState<string[]>([]);
  const [laborHoursEstimate, setLaborHoursEstimate] = useState('');
  const [status, setStatus] = useState<MaintenanceTaskStatus>(MaintenanceTaskStatus.Pending);
  const [priority, setPriority] = useState<MaintenanceTaskPriority>(MaintenanceTaskPriority.Medium);
  const [dueDate, setDueDate] = useState('');
  const [completedAt, setCompletedAt] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<MaintenanceRecurrenceFrequency>(MaintenanceRecurrenceFrequency.None);
  const [recurrenceInterval, setRecurrenceInterval] = useState('1');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setSpaceIds(initialData.spaceIds || []);
      setAssignedContactId(initialData.assignedContactId || '');
      setRequiredInventoryIds(initialData.requiredInventoryIds || []);
      setLaborHoursEstimate(initialData.laborHoursEstimate?.toString() || '');
      setStatus(initialData.status);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDateUtc?.split('T')[0] || '');
      setCompletedAt(initialData.completedAtUtc?.split('T')[0] || '');
      setEstimatedCost(initialData.estimatedCost?.toString() || '');
      setActualCost(initialData.actualCost?.toString() || '');
      setRecurrenceFrequency(initialData.recurrence?.frequency || MaintenanceRecurrenceFrequency.None);
      setRecurrenceInterval(initialData.recurrence?.interval?.toString() || '1');
      setTags(initialData.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setSpaceIds([]);
      setAssignedContactId('');
      setRequiredInventoryIds([]);
      setLaborHoursEstimate('');
      setStatus(MaintenanceTaskStatus.Pending);
      setPriority(MaintenanceTaskPriority.Medium);
      setDueDate('');
      setCompletedAt('');
      setEstimatedCost('');
      setActualCost('');
      setRecurrenceFrequency(MaintenanceRecurrenceFrequency.None);
      setRecurrenceInterval('1');
      setTags(['Maintenance']);
    }
  }, [initialData, isOpen]);

  const toggleSpace = (id: string) => {
    setSpaceIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleInventory = (id: string) => {
    setRequiredInventoryIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      spaceIds,
      assignedContactId: assignedContactId || null,
      requiredInventoryIds,
      laborHoursEstimate: laborHoursEstimate ? parseFloat(laborHoursEstimate) : null,
      status,
      priority,
      dueDateUtc: dueDate ? new Date(dueDate).toISOString() : null,
      completedAtUtc: completedAt ? new Date(completedAt).toISOString() : null,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
      actualCost: actualCost ? parseFloat(actualCost) : null,
      recurrence: recurrenceFrequency !== MaintenanceRecurrenceFrequency.None ? {
        frequency: recurrenceFrequency,
        interval: parseInt(recurrenceInterval) || 1
      } : null,
      tags
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
            {initialData ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <SectionHeading label="Core Logistics" icon={Wrench} />
            <Input 
              autoFocus
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inspect Smoke Detectors"
              required
            />
            <Input 
              textarea
              label="Task Scope"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed procedures or tools required..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <SectionHeading label="Targeted Spaces" icon={Layout} />
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  {availableSpaces.map(s => {
                    const isActive = spaceIds.includes(s.id);
                    return (
                      <button key={s.id} type="button" onClick={() => toggleSpace(s.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center space-x-2 ${isActive ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                        {isActive && <Check size={10} />} <span>{s.name}</span>
                      </button>
                    );
                  })}
                </div>
             </div>
             <div className="space-y-4">
                <SectionHeading label="Required Materials" icon={Box} />
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-100 rounded-xl">
                   {availableInventory.map(item => {
                     const isActive = requiredInventoryIds.includes(item.id);
                     return (
                       <button key={item.id} type="button" onClick={() => toggleInventory(item.id)}
                         className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all flex items-center space-x-2 ${isActive ? 'bg-[#5a6b5d] text-white border-[#5a6b5d] shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
                         {isActive && <Check size={10} />} <span>{item.name}</span>
                       </button>
                     );
                   })}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <User size={10} className="mr-1.5" /> Designated Vendor
              </label>
              <select 
                value={assignedContactId}
                onChange={(e) => setAssignedContactId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                <option value="">Manual/Internal</option>
                {availableContacts.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.surname}</option>)}
              </select>
            </div>
             <Input label="Est. Labor Hours" icon={Clock} type="number" step="0.5" value={laborHoursEstimate} onChange={(e) => setLaborHoursEstimate(e.target.value)} placeholder="0.0" />
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow State</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as MaintenanceTaskStatus)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                {STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity Rank</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as MaintenanceTaskPriority)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                {PRIORITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <SectionHeading label="Recurrence Engine" icon={Repeat} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automation Frequency</label>
                <select 
                  value={recurrenceFrequency}
                  onChange={(e) => setRecurrenceFrequency(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
                >
                  {RECURRENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              {recurrenceFrequency !== MaintenanceRecurrenceFrequency.None && (
                <Input 
                  label="Schedule Gap"
                  type="number"
                  min="1"
                  value={recurrenceInterval}
                  onChange={(e) => setRecurrenceInterval(e.target.value)}
                  placeholder="Every X units"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Target Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Input label="Completion Date" icon={CheckCircle} type="date" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-6">
             <Input label="Provisional Cost" icon={DollarSign} type="number" step="0.01" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} />
             <Input label="Actual Total Cost" icon={CheckCircle} type="number" step="0.01" value={actualCost} onChange={(e) => setActualCost(e.target.value)} />
          </div>
        </form>

        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end space-x-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
            Dismiss
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            {initialData ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTaskModal;
