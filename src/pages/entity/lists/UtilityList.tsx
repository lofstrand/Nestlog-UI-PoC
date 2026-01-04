import React, { useMemo, useState } from "react";
import { Droplets, Flame, Globe, Plus, Search, Wind, Zap } from "lucide-react";
import type { Contact, Space, UtilityAccount } from "../../../types";
import UtilityAccountModal from "@/features/utilities/components/UtilityAccountModal";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Button, Card, DataTable, PageHeader, RowActionsMenu } from "@/components/ui";

interface UtilityListProps {
  accounts: UtilityAccount[];
  contacts: Contact[];
  availableSpaces: Space[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onUpsert: (data: Partial<UtilityAccount>, id?: string) => string;
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
}

const UtilityList: React.FC<UtilityListProps> = ({
  accounts,
  contacts,
  availableSpaces,
  onView,
  onUpsert,
  onQuickAddContact,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<UtilityAccount | null>(null);
  const { formatCurrency } = usePreferences();

  const filtered = useMemo(
    () =>
      accounts.filter(
        (a) =>
          (a.title || a.type).toLowerCase().includes(filter.toLowerCase()) ||
          a.accountNumber.toLowerCase().includes(filter.toLowerCase())
      ),
    [accounts, filter]
  );

  const getUtilityIcon = (type: string) => {
    switch (type) {
      case "Electricity":
        return <Zap size={20} className="text-amber-500" />;
      case "Water":
        return <Droplets size={20} className="text-blue-500" />;
      case "Gas":
        return <Flame size={20} className="text-orange-500" />;
      case "Internet":
        return <Globe size={20} className="text-indigo-500" />;
      default:
        return <Wind size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Utilities"
        description="Core operational consumption and infrastructure accounts."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditingAccount(null);
              setIsModalOpen(true);
            }}
          >
            New Utility
          </Button>
        }
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Filter utilities..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<UtilityAccount>
          rows={filtered}
          getRowKey={(row) => row.id}
          columns={[
            {
              id: "identity",
              header: "Service Identity / Provider",
              cell: (a) => {
                const provider = contacts.find((c) => c.id === a.providerId);
                return (
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      {getUtilityIcon(a.type)}
                    </div>
                    <div>
                      <span
                        className="font-black text-slate-900 text-lg block leading-tight cursor-pointer hover:text-slate-600 transition-colors"
                        onClick={() => onView(a.id)}
                      >
                        {a.title || a.type}
                      </span>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                        {a.type} ·{" "}
                        {provider
                          ? `${provider.company || provider.firstName}`
                          : "Unlinked Provider"}
                      </p>
                    </div>
                  </div>
                );
              },
            },
            {
              id: "burn",
              header: "Avg. Burn",
              cell: (a) => (
                <div className="flex items-center space-x-1.5 text-[#5a6b5d] font-black text-sm">
                  <span>
                    {formatCurrency(a.averageMonthlyCost, {
                      maximumFractionDigits: 0,
                    })}
                    /mo
                  </span>
                </div>
              ),
            },
            {
              id: "account",
              header: "Account Details",
              cell: (a) => (
                <p className="text-sm font-bold text-slate-800 tracking-tighter">
                  ID: {a.accountNumber}
                </p>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (a) => <RowActionsMenu onView={() => onView(a.id)} />,
            },
          ]}
        />
      </Card>

      <UtilityAccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
        }}
        availableContacts={contacts}
        availableSpaces={availableSpaces}
        initialData={editingAccount}
        onQuickAddContact={onQuickAddContact}
        onSave={(data) => {
          const id = onUpsert(data, editingAccount?.id);
          setIsModalOpen(false);
          setEditingAccount(null);
          onView(id);
        }}
      />
    </div>
  );
};

export default UtilityList;

