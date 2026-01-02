
import React, { useState, useMemo } from 'react';
import { Bell, Search, Filter, Trash2, CheckCircle, Wrench, ShieldAlert, Sparkles, Info, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Card, PageHeader, Button, Badge } from './UIPrimitives';

interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  date: string;
  type: 'maintenance' | 'security' | 'system' | 'advisor';
  isUnread: boolean;
}

const MOCK_ARCHIVE: Notification[] = [
  { id: '1', title: 'HVAC Filter Due', desc: 'Lakeside Cabin main unit needs a filter swap.', time: '12m ago', date: '2024-05-15', type: 'maintenance', isUnread: true },
  { id: '2', title: 'Warranty Expiring', desc: 'LG Refrigerator warranty ends in 3 days.', time: '2h ago', date: '2024-05-15', type: 'security', isUnread: true },
  { id: '3', title: 'AI Recommendation', desc: 'New layout suggested for your Library view.', time: '5h ago', date: '2024-05-15', type: 'advisor', isUnread: false },
  { id: '4', title: 'System Update', desc: 'Nestlog Pro v2.4.1 is now active.', time: '1d ago', date: '2024-05-14', type: 'system', isUnread: false },
  { id: '5', title: 'Project Milestone', desc: 'Backyard lighting installation completed.', time: '2d ago', date: '2024-05-13', type: 'maintenance', isUnread: false },
  { id: '6', title: 'Policy Renewal', desc: 'Homeowners insurance policy renewed successfully.', time: '3d ago', date: '2024-05-12', type: 'security', isUnread: false },
  { id: '7', title: 'New Document Logged', desc: 'Dyson V11 manual added to Library.', time: '5d ago', date: '2024-05-10', type: 'system', isUnread: false },
  { id: '8', title: 'Maintenance Alert', desc: 'Quarterly roof inspection suggested.', time: '1w ago', date: '2024-05-08', type: 'maintenance', isUnread: false },
];

const NotificationsArchive: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_ARCHIVE);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(filter.toLowerCase()) || n.desc.toLowerCase().includes(filter.toLowerCase());
      const matchesType = typeFilter === 'all' || n.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [notifications, filter, typeFilter]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench size={20} className="text-[#a47148]" />;
      case 'security': return <ShieldAlert size={20} className="text-[#b45c43]" />;
      case 'advisor': return <Sparkles size={20} className="text-indigo-500" />;
      default: return <Info size={20} className="text-slate-400" />;
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Alert Console Archive" 
        description="Historical log of system notifications, maintenance alerts, and security updates."
        action={
          <div className="flex items-center space-x-2">
            <Button variant="secondary" icon={CheckCircle} onClick={markAllRead}>Mark all read</Button>
            <Button variant="danger" icon={Trash2} onClick={() => setNotifications([])}>Clear Archive</Button>
          </div>
        }
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative group w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800" />
            <input 
              type="text" placeholder="Search archive..." value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 w-full md:w-auto">
            {['all', 'maintenance', 'security', 'system', 'advisor'].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`
                  px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap
                  ${typeFilter === t ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div key={n.id} className={`px-8 py-6 flex items-start space-x-6 transition-colors group ${n.isUnread ? 'bg-indigo-50/20' : 'hover:bg-slate-50/50'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${n.isUnread ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                  {getNotificationIcon(n.type)}
                </div>
                
                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={`text-lg tracking-tight ${n.isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{n.title}</h3>
                    <Badge color="text-slate-400" bgColor="bg-slate-50" className="opacity-60">{n.type}</Badge>
                    {n.isUnread && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{n.desc}</p>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={12} className="mr-1.5" />
                      {n.time} • {n.date}
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" icon={Trash2} className="hover:text-[#b45c43]" onClick={() => deleteNotification(n.id)} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center">
              <Bell size={48} className="mx-auto text-slate-100 mb-4" />
              <h4 className="text-lg font-bold text-slate-400">Archive matches unpopulated</h4>
              <p className="text-sm text-slate-300 max-w-xs mx-auto mt-1">Try adjusting your filters or search criteria to locate specific alerts.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NotificationsArchive;
