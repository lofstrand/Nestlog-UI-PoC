
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, FileText, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Shield, Link } from 'lucide-react';
import { Document, Space, InventoryItem, Tag, Project, MaintenanceTask, Contact } from "../../../types";
import DocumentModal from "@/features/documents/components/DocumentModal";
import { Button, Card, PageHeader, Badge } from "../../../components/ui/UIPrimitives";
import DocumentPreview from "../../../components/sections/DocumentPreview";

interface DocumentsListProps {
  documents: Document[];
  spaces: Space[];
  inventory: InventoryItem[];
  projects: Project[];
  tasks: MaintenanceTask[];
  contacts: Contact[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ documents, spaces, inventory, projects, tasks, contacts, availableTags, onRefresh, onView, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Document; direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (key: keyof Document) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = documents.filter(d => d.title.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '') as string | number;
      const bValue = (b[sortConfig.key] || '') as string | number;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [documents, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof Document }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  const getLinkCount = (doc: Document) => {
    return (doc.projectIds?.length || 0) + (doc.taskIds?.length || 0) + (doc.inventoryItems?.length || 0) + (doc.surfaceIds?.length || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Documents" 
        description="A safe place for your receipts, warranties, and property manuals."
        action={<Button icon={Plus} onClick={() => setIsModalOpen(true)}>New Document</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Search by document name..." value={filter}
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
                    Document Name <SortIcon column="title" />
                  </button>
                </th>
                <th className="px-8 py-4">
                   <button onClick={() => handleSort('category')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Category <SortIcon column="category" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Associated Items</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group/row">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      {d.attachments && d.attachments.length > 0 ? (
                        <DocumentPreview attachment={d.attachments[0]} size="md" className="shadow-lg group-hover/row:scale-105 transition-transform" />
                      ) : (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${d.isPrivate ? 'bg-[#b45c43] text-white shadow-lg shadow-[#b45c43]/20' : 'bg-slate-100 border border-slate-200 text-slate-400 shadow-sm'}`}>
                          {d.isPrivate ? <Shield size={20} /> : <FileText size={20} />}
                        </div>
                      )}
                      <div>
                        <span className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight" onClick={() => onView(d.id)}>{d.title}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {d.isPrivate && <Badge color="text-white" bgColor="bg-[#b45c43]" borderColor="border-[#b45c43]">Private</Badge>}
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Added {new Date(d.createdAtUtc).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge color="text-slate-400" bgColor="bg-slate-50" borderColor="border-slate-100">
                      {d.category || 'Uncategorized'}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-1.5 text-slate-400 font-black text-[10px]">
                      <Link size={12} />
                      <span>{getLinkCount(d)} Links</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(d.id)}>View</Button>
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
      <DocumentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={() => setIsModalOpen(false)} 
        availableSpaces={spaces} 
        availableInventory={inventory}
        availableProjects={projects}
        availableTasks={tasks}
        availableContacts={contacts}
      />
    </div>
  );
};

export default DocumentsList;
