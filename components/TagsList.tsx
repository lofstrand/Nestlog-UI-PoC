
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { Tag } from '../types';
import TagModal from './TagModal';
import { Button, Card, PageHeader, Badge, DynamicIcon } from './UIPrimitives';

interface TagsListProps {
  tags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
}

const TagsList: React.FC<TagsListProps> = ({ tags, onRefresh, onView }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tag; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: keyof Tag) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = tags.filter(t => t.name.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '') as string | number;
      const bValue = (b[sortConfig.key] || '') as string | number;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tags, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof Tag }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Index Tags" 
        description="Global cross-referencing system for unified data classification."
        action={<Button icon={Plus} onClick={() => setIsModalOpen(true)}>New index tag</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Filter global index..." value={filter}
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
                    Label Identity <SortIcon column="name" />
                  </button>
                </th>
                <th className="px-8 py-4">
                   <button onClick={() => handleSort('usageCount')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Usage Intensity <SortIcon column="usageCount" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Context</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg" 
                        style={{ backgroundColor: t.colorHex || '#1e293b' }}
                      >
                        <DynamicIcon name={t.iconName || 'Tag'} size={18} />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight" onClick={() => onView(t.id)}>{t.name}</span>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate max-w-xs">{t.description || 'No usage guidelines'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <BarChart2 size={14} className="text-slate-300" />
                       <span className="text-sm font-black text-slate-800">{t.usageCount || 0} Entities</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.colorHex || '#1e293b' }} />
                       <Badge color="text-slate-400" bgColor="bg-slate-50">Global Scope</Badge>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(t.id)}>View</Button>
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
      <TagModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={() => setIsModalOpen(false)} initialData={null} />
    </div>
  );
};

export default TagsList;
