
import React, { useState } from 'react';
import { Mail, Shield, Users } from 'lucide-react';
import { Input, Modal } from "@/components/ui";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
  householdName: string;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite, householdName }) => {
  const formId = "invite-modal-form";
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Member"
      subtitle={householdName}
      icon={Users}
      size="sm"
      primaryActionLabel="Send Invite"
      primaryActionType="submit"
      formId={formId}
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          Cancel
        </button>
      }
    >
        <form id={formId} onSubmit={handleSubmit} className="space-y-6">
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
        </form>
    </Modal>
  );
};

export default InviteModal;
