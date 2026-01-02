
import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Box, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { InventoryItem, Space, InventoryCategory, Tag, InventoryItemStatus } from '../types';
import InventoryModal from './InventoryModal';
import { Button, Card, PageHeader, Badge } from './UIPrimitives';

interface InventoryListProps {
  items: InventoryItem[];
  spaces: Space[];
  categories: InventoryCategory[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, spaces, categories, availableTags, onRefresh, onView, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '') as string | number;
      const bValue = (b[sortConfig.key] || '') as string | number;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [items, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof InventoryItem }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  const getStatusBadge = (status: InventoryItemStatus) => {
    switch (status) {
      case InventoryItemStatus.Excellent: return <Badge color="text-[#5a6b5d]" bgColor="bg-[#f2f4f2]" borderColor="border-[#e1e6e1]">Excellent</Badge>;
      case InventoryItemStatus.Fair: return <Badge color="text-[#a47148]" bgColor="bg-[#f9f4f0]" borderColor="border-[#f1e6df]">Fair</Badge>;
      case InventoryItemStatus.Broken: return <Badge color="text-[#b45c43]" bgColor="bg-[#fdf3f0]" borderColor="border-[#f9dad3]">Broken</Badge>;
      default: return <Badge color="text-slate-500" bgColor="bg-slate-50">Good</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Inventory" 
        description="Global catalog of household belongings, equipment, and valuables."
        action={<Button icon={Plus} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>New item</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Search inventory..." value={filter}
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
                  <button onClick={() => handleSort('name')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Item / Identity <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-8 py-4">
                   <button onClick={() => handleSort('status')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Condition <SortIcon column="status" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock & Category</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm group-hover/row:bg-white transition-all">
                        <Box size={20} />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight" onClick={() => onView(item.id)}>{item.name}</span>
                        <div className="flex items-center space-x-2 mt-1">
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                            {spaces.find(s => s.id === item.spaceId)?.name || 'Unassigned'}
                           </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <div className="flex items-center space-x-1.5 text-slate-900 font-black text-sm">
                          <span className="text-[#1a2e4c]">x{item.quantity}</span>
                          <span className="text-[10px] text-slate-400 uppercase">{item.unit}</span>
                       </div>
                       <Badge color="text-slate-400" bgColor="bg-slate-50" borderColor="border-slate-100">
                        {item.category}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(item.id)} />
                      <Button variant="ghost" size="sm" icon={Edit2} onClick={() => { setEditingItem(item); setIsModalOpen(true); }} />
                      <Button variant="ghost" size="sm" icon={Trash2} className="hover:text-[#b45c43]" onClick={() => onDelete(item.id)} />
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
      {/* Fixed: Passed required allInventory prop from items array to fix TypeScript error */}
      <InventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => setIsModalOpen(false)} 
        initialData={editingItem} 
        availableSpaces={spaces} 
        availableCategories={categories} 
        allInventory={items}
      />
    </div>
  );
};

export default InventoryList;
