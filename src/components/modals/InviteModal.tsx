
import React, { useState } from 'react';
import { X, Mail, Send, Shield, Users } from 'lucide-react';
import { Button, Input, SectionHeading } from "../ui/UIPrimitives";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
  householdName: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite, householdName }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email);
      setEmail('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Users size={20} />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Invite Member</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{householdName}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Invited members will receive an email to join <strong>{householdName}</strong>. You can configure their specific property roles after they accept.
            </p>
            <Input 
              autoFocus
              label="Member Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@domain.com"
              required
            />
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start space-x-3">
             <Shield size={16} className="text-indigo-600 mt-0.5 shrink-0" />
             <p className="text-[11px] text-indigo-700 font-medium leading-normal">
               Security Note: Invitations expire in 48 hours. Only verified Nestlog accounts can access managed infrastructure details.
             </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <Button 
              type="submit"
              icon={Send}
              className="px-8 py-2.5"
            >
              Send Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
