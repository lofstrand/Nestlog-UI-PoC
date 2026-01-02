
import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, ShieldCheck, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import { InsurancePolicy, Contact } from '../types';
import { Button, Card, PageHeader, Badge } from './UIPrimitives';
import InsurancePolicyModal from './InsurancePolicyModal';

interface InsuranceListProps {
  policies: InsurancePolicy[];
  contacts: Contact[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onSave: (data: Partial<InsurancePolicy>) => void;
  // Added onQuickAddContact to InsuranceListProps to fix TypeScript error in App.tsx
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
}

const InsuranceList: React.FC<InsuranceListProps> = ({ policies, contacts, onView, onDelete, onEdit, onSave, onQuickAddContact }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InsurancePolicy; direction: 'asc' | 'desc' }>({ key: 'renewalDate', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (key: keyof InsurancePolicy) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = policies.filter(p => 
      p.title?.toLowerCase().includes(filter.toLowerCase()) || 
      p.policyNumber.toLowerCase().includes(filter.toLowerCase()) || 
      p.type.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || '') as string | number;
      const bValue = (b[sortConfig.key] || '') as string | number;
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [policies, filter, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const SortIcon = ({ column }: { column: keyof InsurancePolicy }) => {
    if (sortConfig.key !== column) return <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />;
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-slate-900" /> : <ChevronDown size={14} className="text-slate-900" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Insurance" 
        description="Active coverage logs and financial protection layers."
        action={<Button icon={Plus} onClick={() => { setEditingPolicy(null); setIsModalOpen(true); }}>New Insurance Policy</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Search policies or titles..." value={filter}
              onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4">
                  <button onClick={() => handleSort('title')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Policy / Identity <SortIcon column="title" />
                  </button>
                </th>
                <th className="px-8 py-4">
                   <button onClick={() => handleSort('coverageLimit')} className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Limit <SortIcon column="coverageLimit" />
                  </button>
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium / Ded..</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Incidents</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((p) => {
                const carrier = contacts.find(c => c.id === p.providerId);
                const activeClaims = p.claims?.filter(c => c.status !== 'Closed' && c.status !== 'Settled' && c.status !== 'Denied').length || 0;
                const totalRecovered = p.claims?.reduce((acc, c) => acc + (c.payoutAmount || 0), 0) || 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${activeClaims > 0 ? 'ring-2 ring-[#b45c43] ring-offset-2' : ''}`}>
                          <ShieldCheck size={20} className={activeClaims > 0 ? 'text-[#b45c43]' : 'text-[#5a6b5d]'} />
                        </div>
                        <div>
                          <span className="font-black text-slate-900 text-lg cursor-pointer block leading-tight hover:text-slate-600" onClick={() => onView(p.id)}>{p.title || p.type}</span>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                            {p.type} • {carrier ? (carrier.company || carrier.firstName) : 'Private'} • {p.policyNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-slate-800">${p.coverageLimit.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-slate-900 font-black text-xs">
                           <span>${p.premium}/mo</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Ded: ${p.deductible}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       {totalRecovered > 0 ? (
                         <div className="flex items-center space-x-2 text-[#5a6b5d]">
                            <TrendingUp size={12} strokeWidth={3} />
                            <span className="text-xs font-black">+${totalRecovered.toLocaleString()}</span>
                         </div>
                       ) : (
                         <span className="text-[10px] font-bold text-slate-300 uppercase">None logged</span>
                       )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(p.id)}>View</Button>
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
      <InsurancePolicyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        availableContacts={contacts}
        initialData={editingPolicy}
        // Fixed: Passed onQuickAddContact to InsurancePolicyModal
        onQuickAddContact={onQuickAddContact}
        onSave={(data) => {
          onSave(editingPolicy ? { ...editingPolicy, ...data } : data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default InsuranceList;
