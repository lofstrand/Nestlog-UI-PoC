
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldCheck, Wrench, Package, TrendingUp } from 'lucide-react';
import { Household, View } from '../types';

interface DashboardProps {
  households: Household[];
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ households, onNavigate }) => {
  const data = households.map(h => ({
    name: h.name,
    properties: h.propertyCount,
  }));

  const stats = [
    { label: 'Managed Households', value: households.length, icon: ShieldCheck, color: 'text-slate-700', bg: 'bg-slate-100', view: 'households' as View },
    { label: 'Managed Properties', value: households.reduce((acc, h) => acc + h.propertyCount, 0), icon: Package, color: 'text-[#5a6b5d]', bg: 'bg-[#f2f4f2]', view: 'properties' as View },
    { label: 'Active Tasks', value: 4, icon: Wrench, color: 'text-[#a47148]', bg: 'bg-[#f9f4f0]', view: 'maintenance' as View },
    { label: 'Asset Valuation', value: '8.4M kr', icon: TrendingUp, color: 'text-[#3a5a40]', bg: 'bg-[#f0f4f1]', view: 'inventory' as View },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(stat.view)}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                <stat.icon size={22} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</span>
            </div>
            <div className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{stat.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Household Property Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="properties" radius={[6, 6, 0, 0]} barSize={32}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1e293b' : '#5a6b5d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">System Pulse</h3>
          <div className="space-y-6">
            {[
              { title: 'OVK Task Created', desc: 'Penthouse ventilation check', time: 'Just now', color: 'bg-[#a47148]' },
              { title: 'Solar Project Update', desc: 'Panels mounted in Nacka', time: '1d ago', color: 'bg-[#5a6b5d]' },
              { title: 'Inventory Log', desc: 'Sub-Zero Fridge linked', time: '3d ago', color: 'bg-slate-800' },
              { title: 'Payment Verified', desc: 'Internet monthly detected', time: '5d ago', color: 'bg-[#b45c43]' },
            ].map((activity, i) => (
              <div key={i} className="flex space-x-4 group cursor-default">
                <div className="mt-1.5 flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${activity.color} group-hover:scale-150 transition-transform`}></div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{activity.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onNavigate('activity_log')}
            className="w-full mt-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-800 hover:bg-slate-900 hover:text-white rounded-xl border border-slate-100 transition-all active:scale-95 shadow-sm hover:shadow-lg"
          >
            Full Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
