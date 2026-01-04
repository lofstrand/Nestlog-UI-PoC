
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Household, Tag } from "../../../types";
import HouseholdModal from "@/features/households/components/HouseholdModal";
import { Button, Card, PageHeader, Badge } from "@/components/ui";

interface HouseholdsListProps {
  households: Household[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onUpsert: (data: Partial<Household>, id?: string) => string;
}

const HouseholdsList: React.FC<HouseholdsListProps> = ({ households, availableTags, onRefresh, onView, onDelete, onUpsert }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Household; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key: keyof Household) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = households.filter(h => 
      h.name.toLowerCase().includes(filter.toLowerCase()) || 
      h.description.toLowerCase().includes(filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [households, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof Household }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Households" 
        description="Active managed workspaces for your properties."
        action={
          <Button icon={Plus} onClick={() => { setEditingHousehold(null); setIsModalOpen(true); }}>New household</Button>
        }
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Filter households..." value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-slate-900 shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4">
                  <button onClick={() => handleSort('name')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    <span>Identity</span>
                    <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-8 py-4">
                  <button onClick={() => handleSort('status')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    <span>Status</span>
                    <SortIcon column="status" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-colors group/row">
                  <td className="px-8 py-8">
                    <span className="font-black text-slate-900 text-xl cursor-pointer hover:text-slate-600 transition-colors tracking-tight block mb-1" onClick={() => onView(h.id)}>{h.name}</span>
                    <p className="text-sm text-slate-500 line-clamp-1 max-w-2xl mb-4 font-medium">{h.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {h.tags?.map(tagName => {
                        const tagDef = availableTags.find(t => t.name === tagName);
                        const color = tagDef?.colorHex || '#1e293b';
                        return (
                          <span key={tagName} className="px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tight" style={{ backgroundColor: `${color}08`, color: color, borderColor: `${color}20` }}>
                            {tagName}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <Badge 
                      color={h.status === 'Active' ? 'text-[#5a6b5d]' : 'text-slate-400'} 
                      bgColor={h.status === 'Active' ? 'bg-[#f2f4f2]' : 'bg-slate-50'}
                      borderColor={h.status === 'Active' ? 'border-[#e1e6e1]' : 'border-slate-200'}
                    >
                      {h.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(h.id)}>View</Button>
                    </div>
                  </td>
                </tr>
              ))}
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

      <HouseholdModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHousehold(null);
        }}
        onSave={(data) => {
          const id = onUpsert(data, editingHousehold?.id);
          setIsModalOpen(false);
          setEditingHousehold(null);
          onView(id);
        }}
        initialData={editingHousehold}
      />
    </div>
  );
};

export default HouseholdsList;
