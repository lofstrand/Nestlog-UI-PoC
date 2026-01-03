
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Repeat, MapPin } from 'lucide-react';
import { MaintenanceTask, MaintenanceTaskPriority, Space, Tag, MaintenanceRecurrenceFrequency, InventoryItem, Contact } from "../../../types";
import MaintenanceTaskModal from "@/features/maintenance/components/MaintenanceTaskModal";
import { Button, Card, PageHeader, Badge } from "@/components/ui";

interface MaintenanceListProps {
  tasks: MaintenanceTask[];
  spaces: Space[];
  availableTags: Tag[];
  availableInventory: InventoryItem[];
  availableContacts: Contact[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({ 
  tasks, 
  spaces, 
  availableTags, 
  availableInventory, 
  availableContacts, 
  onRefresh, 
  onView, 
  onDelete 
}) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof MaintenanceTask; direction: 'asc' | 'desc' }>({ key: 'dueDateUtc', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key: keyof MaintenanceTask) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = tasks.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));
    const priorityWeight = { [MaintenanceTaskPriority.Urgent]: 4, [MaintenanceTaskPriority.High]: 3, [MaintenanceTaskPriority.Medium]: 2, [MaintenanceTaskPriority.Low]: 1 };
    return filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];
      if (sortConfig.key === 'priority') {
        aValue = priorityWeight[a.priority as MaintenanceTaskPriority] || 0;
        bValue = priorityWeight[b.priority as MaintenanceTaskPriority] || 0;
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPriorityColor = (p: MaintenanceTaskPriority) => {
    switch (p) {
      case MaintenanceTaskPriority.Urgent: return { color: 'text-[#b45c43]', bg: 'bg-[#fdf3f0]', border: 'border-[#f9dad3]' };
      case MaintenanceTaskPriority.High: return { color: 'text-[#a47148]', bg: 'bg-[#f9f4f0]', border: 'border-[#f1e6df]' };
      case MaintenanceTaskPriority.Medium: return { color: 'text-[#5a6b5d]', bg: 'bg-[#f2f4f2]', border: 'border-[#e1e6e1]' };
      default: return { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  const SortIcon = ({ column }: { column: keyof MaintenanceTask }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  const getSpacesSummary = (spaceIds: string[]) => {
    if (!spaceIds || spaceIds.length === 0) return 'Global Property';
    const firstSpace = spaces.find(s => s.id === spaceIds[0]);
    if (!firstSpace) return 'Global Property';
    if (spaceIds.length === 1) return firstSpace.name;
    return `${firstSpace.name} + ${spaceIds.length - 1} others`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Maintenance" 
        description="Track and schedule property upkeep."
        action={<Button icon={Plus} onClick={() => { setIsModalOpen(true); }}>New Task</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Search maintenance logs..." value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4">
                  <button onClick={() => handleSort('title')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Task Details <SortIcon column="title" />
                  </button>
                </th>
                <th className="px-8 py-4">
                  <button onClick={() => handleSort('priority')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Priority <SortIcon column="priority" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Cost</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((t) => {
                const styles = getPriorityColor(t.priority);
                const isRecurring = t.recurrence && t.recurrence.frequency !== MaintenanceRecurrenceFrequency.None;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group/row">
                    <td className="px-8 py-8">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-black text-slate-900 text-xl cursor-pointer hover:text-slate-600 transition-colors tracking-tight" onClick={() => onView(t.id)}>{t.title}</span>
                        {isRecurring && <Repeat size={14} className="text-[#a47148]" strokeWidth={3} />}
                      </div>
                      <div className="flex items-center space-x-3">
                         <div className="flex items-center text-[9px] font-black text-[#5a6b5d] uppercase tracking-widest">
                            <MapPin size={10} className="mr-1" />
                            <span>{getSpacesSummary(t.spaceIds)}</span>
                          </div>
                        <div className="flex items-center space-x-2">
                          {t.tags?.map(tagName => (
                            <span key={tagName} className="px-2 py-0.5 rounded-lg text-[9px] font-bold border border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight">
                              {tagName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <Badge color={styles.color} bgColor={styles.bg} borderColor={styles.border}>{t.priority}</Badge>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-sm font-black text-slate-800">{t.estimatedCost?.toLocaleString() || '—'} kr</span>
                    </td>
                    <td className="px-8 py-8 text-sm font-bold text-slate-500">
                      {t.dueDateUtc ? new Date(t.dueDateUtc).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(t.id)}>View</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, processedItems.length)} of {processedItems.length}
            </p>
            <div className="flex items-center space-x-1">
              <Button variant="white" size="sm" icon={ChevronLeft} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
              <Button variant="white" size="sm" icon={ChevronRight} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
            </div>
          </div>
        )}
      </Card>

      <MaintenanceTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => setIsModalOpen(false)} 
        initialData={null} 
        availableSpaces={spaces} 
        availableContacts={availableContacts} 
        availableInventory={availableInventory}
      />
    </div>
  );
};

export default MaintenanceList;
