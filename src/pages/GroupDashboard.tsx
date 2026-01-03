
import React from 'react';
import { ArrowRight, ShieldCheck, Wrench, FileText, Users, Box, Tags, LayoutGrid, Home, Building2, Layout, FolderOpen, Zap, DollarSign, Wallet, TrendingDown, Clock, Calendar, AlertCircle } from 'lucide-react';
import { View } from "../types";
import { usePreferences } from "@/contexts/PreferencesContext";

interface GroupDashboardProps {
  title: string;
  type: 'workspace' | 'planner' | 'finance' | 'global' | 'library';
  onNavigate: (view: View) => void;
  stats: any;
  financeData?: {
    totalMonthlyCommitment: number;
    insuranceLoad: number;
    utilityBurn: number;
    upcomingDeadlines: Array<{
      id: string;
      label: string;
      type: 'renewal' | 'payment';
      date: string;
      amount?: number;
      urgency: 'critical' | 'soon' | 'normal';
    }>;
  };
}

const GroupDashboard: React.FC<GroupDashboardProps> = ({ title, type, onNavigate, stats, financeData }) => {
  const { formatCurrency } = usePreferences();
  const dashboards = {
    workspace: [
      { id: 'households', label: 'Households', desc: 'Managed workspaces', icon: Home, color: 'text-slate-800', bg: 'bg-slate-50', count: stats.households },
      { id: 'properties', label: 'Properties', desc: 'Real estate assets', icon: Building2, color: 'text-[#5a6b5d]', bg: 'bg-[#f2f4f2]', count: stats.properties },
      { id: 'spaces', label: 'Spaces', desc: 'Rooms and outdoor areas', icon: Layout, color: 'text-[#1a2e4c]', bg: 'bg-[#f0f4f8]', count: stats.spaces },
    ],
    planner: [
      { id: 'maintenance', label: 'Maintenance', desc: 'Recurring tasks', icon: Wrench, color: 'text-[#a47148]', bg: 'bg-[#f9f4f0]', count: stats.maintenance },
      { id: 'projects', label: 'Projects', desc: 'Upgrades and remodels', icon: FolderOpen, color: 'text-[#b45c43]', bg: 'bg-[#fdf3f0]', count: stats.projects },
    ],
    finance: [
      { id: 'insurance', label: 'Insurance', desc: 'Active policies', icon: ShieldCheck, color: 'text-[#5a6b5d]', bg: 'bg-[#f2f4f2]', count: stats.insurance },
      { id: 'utilities', label: 'Utilities', desc: 'Operational accounts', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', count: stats.utilities },
    ],
    global: [
      { id: 'contacts', label: 'Contacts', desc: 'People and contractors', icon: Users, color: 'text-[#5a6b5d]', bg: 'bg-[#f2f4f2]', count: stats.contacts },
      { id: 'inventory_categories', label: 'Inventory categories', desc: 'Shared classification rules', icon: LayoutGrid, color: 'text-[#8c7e6d]', bg: 'bg-[#f9f7f4]', count: stats.inventory_categories },
      { id: 'tags', label: 'Tags', desc: 'Global labeling index', icon: Tags, color: 'text-[#4a4e69]', bg: 'bg-[#f2f2f7]', count: stats.tags },
    ],
    library: [
      { id: 'documents', label: 'Documents', desc: 'Manuals and records', icon: FileText, color: 'text-slate-800', bg: 'bg-slate-50', count: stats.documents },
      { id: 'inventory', label: 'Inventory', desc: 'Assets and belongings', icon: Box, color: 'text-[#1a2e4c]', bg: 'bg-[#f0f4f8]', count: stats.inventory },
    ]
  };

  const items = dashboards[type] || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight capitalize">{title} Overview</h1>
        <p className="text-slate-500 font-medium leading-relaxed">Systematic organization of your household financial metadata.</p>
      </div>

      {type === 'finance' && financeData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Spend Hero */}
          <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Wallet size={120} />
            </div>
            <div className="relative z-10 space-y-10">
               <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Cumulative Monthly Spend</p>
                  <div className="flex items-baseline space-x-4">
                     <span className="text-6xl font-black tracking-tighter">{formatCurrency(financeData.totalMonthlyCommitment)}</span>
                     <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Commitment / MO</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Insurance</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(financeData.insuranceLoad)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Utilities</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(financeData.utilityBurn)}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Upcoming Deadlines Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-8 flex flex-col shadow-sm">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Calendar size={16} />
                   </div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Upcoming</h4>
                </div>
                <button onClick={() => onNavigate('utilities')} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-tighter">View Ledger</button>
             </div>
             
             <div className="flex-1 space-y-4">
                {financeData.upcomingDeadlines.length > 0 ? (
                  financeData.upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center space-x-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group/item border border-transparent hover:border-slate-100">
                       <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center border shadow-sm transition-colors ${
                          deadline.urgency === 'critical' ? 'bg-rose-50 border-rose-100 text-rose-600' : 
                          deadline.urgency === 'soon' ? 'bg-amber-50 border-amber-100 text-amber-600' : 
                          'bg-slate-50 border-slate-100 text-slate-400'
                       }`}>
                          <span className="text-[8px] font-black uppercase leading-none">{new Date(deadline.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-sm font-black leading-none mt-0.5">{new Date(deadline.date).getDate()}</span>
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate leading-tight">{deadline.label}</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                             {deadline.type === 'renewal' ? (
                               <ShieldCheck size={10} className="text-[#5a6b5d]" />
                             ) : (
                               <DollarSign size={10} className="text-slate-300" />
                             )}
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               {deadline.type === 'renewal'
                                 ? 'Policy Renewal'
                                 : `Payment: ${formatCurrency(deadline.amount ?? 0)}`}
                             </p>
                          </div>
                       </div>
                       {deadline.urgency === 'critical' && <AlertCircle size={14} className="text-rose-500 animate-pulse" />}
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-2 opacity-50">
                     <Calendar size={32} strokeWidth={1.5} />
                     <p className="text-[10px] font-black uppercase">No Data Logged</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as View)}
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all text-left flex flex-col justify-between aspect-square md:aspect-auto active:scale-[0.98]"
          >
            <div className="space-y-6">
              <div className={`${item.bg} ${item.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm group-hover:shadow-lg`}>
                <item.icon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">{item.label}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <span className="text-5xl font-black text-slate-900/5 group-hover:text-slate-900/10 transition-colors tracking-tighter">{item.count}</span>
              <div className="p-2.5 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white rounded-full transition-all shadow-inner">
                <ArrowRight size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupDashboard;
