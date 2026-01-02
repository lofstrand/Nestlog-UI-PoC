
import React from 'react';
import { Users, UserPlus, Shield, Building2, Trash2, Mail, Clock, ChevronDown, Key } from 'lucide-react';
import { HouseholdMember, HouseholdInvite, Property, PropertyRole } from '../types';
import { SectionHeading, Badge, Button } from './UIPrimitives';

interface HouseholdMembersSectionProps {
  members: HouseholdMember[];
  invites: HouseholdInvite[];
  properties: Property[];
  onInvite: () => void;
  onRemoveMember: (id: string) => void;
  onCancelInvite: (id: string) => void;
  onUpdateRole: (memberId: string, propertyId: string, role: PropertyRole) => void;
}

const HouseholdMembersSection: React.FC<HouseholdMembersSectionProps> = ({ 
  members, invites, properties, onInvite, onRemoveMember, onCancelInvite, onUpdateRole 
}) => {
  const roles: PropertyRole[] = ['Owner', 'Manager', 'Viewer', 'Contractor'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Action */}
      <div className="flex items-center justify-between px-2">
        <SectionHeading label="Active Collaboration" icon={Users} color="text-slate-900" />
        <Button size="sm" icon={UserPlus} onClick={onInvite}>Invite Member</Button>
      </div>

      {/* Members Grid or Empty State */}
      {members.length > 0 ? (
        <div className="space-y-6">
          {members.map(member => (
            <div key={member.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Member Identity Header */}
              <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-slate-200">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full rounded-2xl object-cover" />
                    ) : member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none truncate">{member.name}</h4>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <Mail size={12} className="text-slate-400" />
                      <p className="text-xs font-bold text-slate-500 truncate">{member.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <Badge color="text-[#5a6b5d]" bgColor="bg-white" borderColor="border-slate-200">Verified Member</Badge>
                  <button 
                    onClick={() => onRemoveMember(member.id)}
                    className="p-2.5 text-slate-300 hover:text-[#b45c43] hover:bg-[#fdf3f0] rounded-xl transition-all active:scale-90 border border-transparent hover:border-[#f9dad3]"
                    title="Remove from Household"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Property Role Matrix */}
              <div className="p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Key size={14} className="text-slate-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Access Matrix</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {properties.map(property => {
                    const permission = member.permissions.find(p => p.propertyId === property.id);
                    return (
                      <div key={property.id} className="flex flex-col space-y-3 p-5 bg-slate-50 border border-slate-100 rounded-3xl group hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <Building2 size={14} />
                          </div>
                          <span className="text-sm font-black text-slate-900 tracking-tight truncate flex-1">{property.name}</span>
                        </div>
                        
                        <div className="relative">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Assigned Role</p>
                          <div className="relative group/role">
                            <select 
                              value={permission?.role || 'Viewer'}
                              onChange={(e) => onUpdateRole(member.id, property.id, e.target.value as PropertyRole)}
                              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-[11px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all cursor-pointer shadow-sm"
                            >
                              {roles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/role:text-slate-900 transition-colors" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-white/50 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
            <Users size={40} className="opacity-20" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Solo Operator Mode</p>
          <p className="text-sm text-slate-500 font-medium mt-3 max-w-xs text-center leading-relaxed">
            Collaborative workflows are inactive. Invite family members or managers to coordinate property maintenance together.
          </p>
        </div>
      )}

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-[2.5rem] p-10 space-y-8 shadow-inner">
          <SectionHeading label="Invitation Queue" icon={Clock} color="text-slate-400" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invites.map(invite => (
              <div key={invite.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-400 transition-all animate-pulse">
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-black text-slate-900 truncate tracking-tight">{invite.email}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">Sent {new Date(invite.createdAtUtc).toLocaleDateString()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onCancelInvite(invite.id)}
                  className="p-3 text-slate-300 hover:text-[#b45c43] hover:bg-[#fdf3f0] rounded-xl transition-all"
                  title="Cancel Invitation"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdMembersSection;
