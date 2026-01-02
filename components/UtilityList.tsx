import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Zap, Droplets, Flame, Wind, Globe, DollarSign } from 'lucide-react';
import { UtilityAccount, Contact, Space } from '../types';
import { Button, Card, PageHeader } from './UIPrimitives';
import UtilityAccountModal from './UtilityAccountModal';

interface UtilityListProps {
  accounts: UtilityAccount[];
  contacts: Contact[];
  availableSpaces: Space[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (data: Partial<UtilityAccount>) => void;
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
}

const UtilityList: React.FC<UtilityListProps> = ({ accounts, contacts, availableSpaces, onView, onDelete, onSave, onQuickAddContact }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UtilityAccount | null>(null);

  const filtered = useMemo(() => accounts.filter(a => 
    (a.title || a.type).toLowerCase().includes(filter.toLowerCase()) || 
    a.accountNumber.toLowerCase().includes(filter.toLowerCase())
  ), [accounts, filter]);

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case 'Electricity': return <Zap size={20} className="text-amber-500" />;
      case 'Water': return <Droplets size={20} className="text-blue-500" />;
      case 'Gas': return <Flame size={20} className="text-orange-500" />;
      case 'Internet': return <Globe size={20} className="text-indigo-500" />;
      default: return <Wind size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Utilities" 
        description="Core operational consumption and infrastructure accounts."
        action={<Button icon={Plus} onClick={() => { setEditingAccount(null); setIsModalOpen(true); }}>New Utility</Button>}
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" placeholder="Filter utilities..." value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Identity / Provider</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Burn</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Details</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const provider = contacts.find(c => c.id === a.providerId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group/row">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                          {getUtilityIcon(a.type)}
                        </div>
                        <div>
                          <span className="font-black text-slate-900 text-lg block leading-tight cursor-pointer hover:text-slate-600 transition-colors" onClick={() => onView(a.id)}>{a.title || a.type}</span>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                            {a.type} • {provider ? `${provider.company || provider.firstName}` : 'Unlinked Provider'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center space-x-1.5 text-[#5a6b5d] font-black text-sm">
                          <DollarSign size={14} strokeWidth={3} />
                          <span>{a.averageMonthlyCost}/mo</span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-slate-800 tracking-tighter">ID: {a.accountNumber}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="sm" icon={Eye} onClick={() => onView(a.id)}>View</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <UtilityAccountModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableContacts={contacts}
        availableSpaces={availableSpaces}
        initialData={editingAccount}
        onQuickAddContact={onQuickAddContact}
        onSave={(data) => {
          onSave(editingAccount ? { ...editingAccount, ...data } : data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default UtilityList;
