
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, LayoutGrid, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ShieldAlert, Layers } from 'lucide-react';
import { InventoryCategory } from '../types';
import InventoryCategoryModal from './InventoryCategoryModal';
import { Button, Card, PageHeader, Badge, DynamicIcon } from './UIPrimitives';

interface InventoryCategoriesListProps {
  categories: InventoryCategory[];
  onRefresh: () => void;
  onView: (id: string) => void;
}

const InventoryCategoriesList: React.FC<InventoryCategoriesListProps> = ({ categories, onRefresh, onView }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryCategory; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: keyof InventoryCategory) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = categories.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '') as string | number;
      const bValue = (b[sortConfig.key] || '') as string | number;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [categories, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof InventoryCategory }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Classifications" 
        description="Global taxonomy rules for inventory assets and belongings."
        action={<Button icon={Plus} onClick={() => setIsModalOpen(true)}>New classification</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Filter classification portfolio..." value={filter}
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
                    Classification Identity <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-8 py-4">
                   <button onClick={() => handleSort('sortOrder')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Sequence <SortIcon column="sortOrder" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Flags</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg" 
                        style={{ backgroundColor: c.colorHex || '#1e293b' }}
                      >
                        <DynamicIcon name={c.iconName || 'LayoutGrid'} size={18} />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight" onClick={() => onView(c.id)}>{c.name}</span>
                        {c.parentId && (
                          <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            <Layers size={10} />
                            <span>Child of {categories.find(pc => pc.id === c.parentId)?.name || 'Unlinked'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-800 tracking-tighter">ORD-{c.sortOrder.toString().padStart(3, '0')}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       {c.isInsuranceCritical && (
                         <Badge color="text-[#b45c43]" bgColor="bg-[#fdf3f0]" borderColor="border-[#f9dad3]">
                           <div className="flex items-center space-x-1">
                              <ShieldAlert size={10} />
                              <span>Insurance Critical</span>
                           </div>
                         </Badge>
                       )}
                       {c.estimatedDepreciationRate && (
                         <Badge color="text-[#a47148]" bgColor="bg-[#f9f4f0]">-{c.estimatedDepreciationRate}% DEP</Badge>
                       )}
                       {(c.canHaveChildren ?? true) === false && (
                         <Badge color="text-slate-500" bgColor="bg-slate-50" borderColor="border-slate-100">Leaf</Badge>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(c.id)}>View</Button>
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
      <InventoryCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => setIsModalOpen(false)} 
        initialData={null} 
        availableCategories={categories}
      />
    </div>
  );
};

export default InventoryCategoriesList;
