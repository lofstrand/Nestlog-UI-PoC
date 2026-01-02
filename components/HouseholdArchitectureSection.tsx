
import React from 'react';
import { Info, Shield, Users } from 'lucide-react';
import { Household } from '../types';
import { SectionHeading } from './UIPrimitives';

interface HouseholdArchitectureSectionProps {
  entity: Household;
  memberCount: number;
}

const HouseholdArchitectureSection: React.FC<HouseholdArchitectureSectionProps> = ({ entity, memberCount }) => {
  return (
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
        <div className="flex items-center justify-between">
      <SectionHeading label="Household Architecture" icon={Info} />
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Status</p>
          <div className="flex items-center space-x-3">
            <span className={`w-3 h-3 rounded-full ${entity.status === 'Active' ? 'bg-[#5a6b5d]' : 'bg-slate-300'}`}></span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{entity.status}</span>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Density</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-5xl font-black text-slate-900 tracking-tighter">{entity.propertyCount}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Managed Units</p>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Currency</p>
              <p className="text-lg font-black text-slate-900 tracking-tight">{entity.currencyCode || 'USD'}</p>
            </div>
         </div>
         <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collaborators</p>
              <p className="text-lg font-black text-slate-900 tracking-tight">{memberCount} Active</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HouseholdArchitectureSection;
