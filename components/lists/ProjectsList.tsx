
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, FolderOpen, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Project, Tag, Space, Contact } from "../../types";
import ProjectModal from "../modals/ProjectModal";
import { Button, Card, PageHeader, Badge } from "../ui/UIPrimitives";

interface ProjectsListProps {
  projects: Project[];
  availableTags: Tag[];
  availableSpaces: Space[];
  availableContacts: Contact[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, availableTags, availableSpaces, availableContacts, onRefresh, onView, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (key: keyof Project) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = projects.filter(p => p.title.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '') as string | number;
      const bValue = (b[sortConfig.key] || '') as string | number;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projects, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof Project }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  const getSpacesSummary = (spaceIds: string[]) => {
    if (!spaceIds || spaceIds.length === 0) return 'Global Property';
    const firstSpace = availableSpaces.find(s => s.id === spaceIds[0]);
    if (!firstSpace) return 'Global Property';
    if (spaceIds.length === 1) return firstSpace.name;
    return `${firstSpace.name} + ${spaceIds.length - 1} more`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Projects" 
        description="Comprehensive planning and financial oversight for property upgrades."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>New project</Button>
        }
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Search project portfolio..." value={filter}
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
                    Initiative Identity <SortIcon column="title" />
                  </button>
                </th>
                <th className="px-8 py-4">
                   <button onClick={() => handleSort('status')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Lifecycle <SortIcon column="status" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Burn</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                        <FolderOpen size={20} />
                      </div>
                      <div>
                        <span className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight" onClick={() => onView(p.id)}>{p.title}</span>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Commenced: {p.startDate || 'Unscheduled'}
                          </p>
                          <div className="flex items-center text-[10px] font-black text-[#5a6b5d] uppercase tracking-widest">
                            <MapPin size={10} className="mr-1" />
                            <span>{getSpacesSummary(p.spaceIds)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags?.map(tagName => {
                            const tagDef = availableTags.find(t => t.name === tagName);
                            const color = tagDef?.colorHex || '#1e293b';
                            return (
                              <span key={tagName} className="px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-tight" style={{ backgroundColor: `${color}08`, color: color, borderColor: `${color}15` }}>
                                {tagName}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge>{p.status}</Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-sm font-black text-slate-900">${(p.actualCost || 0).toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">/ ${(p.budget || 0).toLocaleString()}</span>
                      </div>
                      <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${ (p.actualCost || 0) > (p.budget || 0) ? 'bg-[#b45c43]' : 'bg-[#5a6b5d]' }`}
                          style={{ width: `${Math.min(100, ((p.actualCost || 0) / (p.budget || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(p.id)}>View</Button>
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
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => setIsModalOpen(false)} 
        initialData={null} 
        availableSpaces={availableSpaces}
        availableContacts={availableContacts}
      />
    </div>
  );
};

export default ProjectsList;
