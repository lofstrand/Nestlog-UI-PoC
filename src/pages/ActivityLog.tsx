
import React, { useState, useMemo } from 'react';
import { 
  History, Search, Filter, Home, Building2, Layout, Wrench, 
  FolderOpen, Box, FileText, User, ShieldCheck, Zap, MessageSquare, 
  CheckCircle2, PlusCircle, Trash2, Clock, Calendar, ChevronRight 
} from 'lucide-react';
import { Card, PageHeader, Button, Badge } from "@/components/ui";
import { ActivityLogEntry } from "../types";

interface ActivityLogProps {
  activities: ActivityLogEntry[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getEntityIcon = (type: ActivityLogEntry['entityType']) => {
    const size = 16;
    switch (type) {
      case 'household': return <Home size={size} />;
      case 'property': return <Building2 size={size} />;
      case 'space': return <Layout size={size} />;
      case 'task': return <Wrench size={size} />;
      case 'project': return <FolderOpen size={size} />;
      case 'inventory': return <Box size={size} />;
      case 'document': return <FileText size={size} />;
      case 'contact': return <User size={size} />;
      case 'insurance': return <ShieldCheck size={size} />;
      case 'utility': return <Zap size={size} />;
      default: return <History size={size} />;
    }
  };

  const getActionIcon = (action: ActivityLogEntry['action']) => {
    const size = 12;
    switch (action) {
      case 'created': return <PlusCircle size={size} className="text-emerald-500" />;
      case 'completed': return <CheckCircle2 size={size} className="text-blue-500" />;
      case 'note_added': return <MessageSquare size={size} className="text-amber-500" />;
      case 'deleted': return <Trash2 size={size} className="text-red-500" />;
      default: return <Clock size={size} className="text-slate-400" />;
    }
  };

  const filteredActivities = useMemo(() => {
    return activities
      .filter(a => {
        const matchesSearch = a.details.toLowerCase().includes(filter.toLowerCase()) || 
                             a.userName.toLowerCase().includes(filter.toLowerCase());
        const matchesType = typeFilter === 'all' || a.entityType === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activities, filter, typeFilter]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { [key: string]: ActivityLogEntry[] } = {};
    filteredActivities.forEach(a => {
      const date = new Date(a.timestamp).toLocaleDateString(undefined, { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(a);
    });
    return Object.entries(groups);
  }, [filteredActivities]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader 
        title="Full Audit Log" 
        description="Chronological record of every infrastructure change and operational event."
      />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-64 space-y-6 sticky top-24">
          <Card className="p-4 space-y-4">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" placeholder="Search logs..." value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Category Filter</p>
              {['all', 'task', 'project', 'inventory', 'document', 'insurance', 'utility'].map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all
                    ${typeFilter === t ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}
                  `}
                >
                  <span className="capitalize">{t}</span>
                  {typeFilter === t && <ChevronRight size={12} />}
                </button>
              ))}
            </div>
          </Card>

          <div className="bg-slate-900 rounded-2xl p-6 space-y-4 shadow-xl text-white">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-2xl font-black">{activities.length}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Events</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#5a6b5d]">{activities.filter(a => a.action === 'completed').length}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Completions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-10">
          {groupedActivities.length > 0 ? (
            groupedActivities.map(([date, items]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{date}</p>
                  </div>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="space-y-3 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                  {items.map((a) => (
                    <div key={a.id} className="relative pl-12 group">
                      {/* Timeline Dot */}
                      <div className={`
                        absolute left-0 top-1.5 w-10 h-10 rounded-xl border-4 border-[#fcfcf9] flex items-center justify-center z-10 transition-all shadow-sm
                        ${a.action === 'completed' ? 'bg-[#f2f4f2] text-[#5a6b5d]' : 'bg-slate-100 text-slate-400'}
                        group-hover:scale-110 group-hover:shadow-md
                      `}>
                        {getEntityIcon(a.entityType)}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          {getActionIcon(a.action)}
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                           <p className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                            {a.details}
                          </p>
                          <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                            <Clock size={12} className="mr-1.5" />
                            {new Date(a.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                              {a.userName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{a.userName}</span>
                          </div>
                          <Badge color="text-slate-400" bgColor="bg-slate-50" className="opacity-60">{a.entityType}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center bg-white border border-dashed border-slate-200 rounded-[2.5rem]">
              <History size={48} className="mx-auto text-slate-100 mb-4" />
              <h4 className="text-lg font-bold text-slate-400">No events located</h4>
              <p className="text-sm text-slate-300 max-w-xs mx-auto mt-1">Try broadening your search or adjusting the classification filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
