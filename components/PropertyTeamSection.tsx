
import React from 'react';
import { Users, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { HouseholdMember, PropertyRole, Contact } from '../types';
import { SectionHeading, Badge } from './UIPrimitives';

interface PropertyTeamSectionProps {
  members: HouseholdMember[];
  propertyId: string;
  allContacts: Contact[];
  onViewContact: (contactId: string) => void;
}

const PropertyTeamSection: React.FC<PropertyTeamSectionProps> = ({ members, propertyId, allContacts, onViewContact }) => {
  // Filter members who have explicit permissions for this specific property
  const teamMembers = members.filter(member => 
    member.permissions.some(p => p.propertyId === propertyId)
  );

  if (teamMembers.length === 0) return null;

  const getRoleStyles = (role: PropertyRole) => {
    switch (role) {
      case 'Owner': return { color: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-200' };
      case 'Manager': return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      case 'Contractor': return { color: 'text-[#a47148]', bg: 'bg-[#f9f4f0]', border: 'border-[#f1e6df]' };
      default: return { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeading label="Property Team" icon={Users} />
      <div className="space-y-3">
        {teamMembers.map(member => {
          const permission = member.permissions.find(p => p.propertyId === propertyId);
          const role = permission?.role || 'Viewer';
          const styles = getRoleStyles(role);
          
          // Match collaborator to contact record by email
          const matchingContact = allContacts.find(c => c.email?.toLowerCase() === member.email.toLowerCase());
          
          return (
            <button 
              key={member.id} 
              onClick={() => matchingContact && onViewContact(matchingContact.id)}
              disabled={!matchingContact}
              className={`w-full flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all group text-left ${matchingContact ? 'hover:shadow-md hover:border-slate-300 active:scale-[0.98]' : 'cursor-default opacity-80'}`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    member.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-sm font-bold text-slate-900 truncate leading-tight tracking-tight">{member.name}</p>
                    {matchingContact && <ArrowUpRight size={10} className="text-slate-300 group-hover:text-slate-900 transition-colors" />}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{member.email}</p>
                </div>
              </div>
              <Badge 
                color={styles.color} 
                bgColor={styles.bg} 
                borderColor={styles.border}
              >
                {role}
              </Badge>
            </button>
          );
        })}
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
        Team members must have a registered contact profile to enable deep-linking.
      </p>
    </div>
  );
};

export default PropertyTeamSection;
