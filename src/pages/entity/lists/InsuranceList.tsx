import React, { useMemo, useState } from "react";
import { Plus, Search, ShieldCheck, TrendingUp } from "lucide-react";
import type { Contact, InsurancePolicy } from "../../../types";
import InsurancePolicyModal from "@/features/insurance/components/InsurancePolicyModal";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Button, Card, DataTable, PageHeader, Pagination, RowActionsMenu } from "@/components/ui";

interface InsuranceListProps {
  policies: InsurancePolicy[];
  contacts: Contact[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpsert: (data: Partial<InsurancePolicy>, id?: string) => string;
  onQuickAddContact?: (data: Partial<Contact>) => Promise<string>;
}

const InsuranceList: React.FC<InsuranceListProps> = ({
  policies,
  contacts,
  onView,
  onUpsert,
  onQuickAddContact,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InsurancePolicy; direction: "asc" | "desc" }>({
    key: "renewalDate",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { formatCurrency } = usePreferences();

  const handleSort = (key: keyof InsurancePolicy) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = policies.filter(
      (p) =>
        p.title?.toLowerCase().includes(filter.toLowerCase()) ||
        p.policyNumber.toLowerCase().includes(filter.toLowerCase()) ||
        p.type.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [policies, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Insurance"
        description="Active coverage logs and financial protection layers."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditingPolicy(null);
              setIsModalOpen(true);
            }}
          >
            New Insurance Policy
          </Button>
        }
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search policies or titles..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<InsurancePolicy>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "identity",
              header: "Policy / Identity",
              sortable: true,
              sortKey: "title",
              cell: (p) => {
                const carrier = contacts.find((c) => c.id === p.providerId);
                const activeClaims =
                  p.claims?.filter(
                    (c) => c.status !== "Closed" && c.status !== "Settled" && c.status !== "Denied"
                  ).length || 0;
                return (
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                        activeClaims > 0 ? "ring-2 ring-[#b45c43] ring-offset-2" : ""
                      }`}
                    >
                      <ShieldCheck
                        size={20}
                        className={activeClaims > 0 ? "text-[#b45c43]" : "text-[#5a6b5d]"}
                      />
                    </div>
                    <div>
                      <span
                        className="font-black text-slate-900 text-lg cursor-pointer block leading-tight hover:text-slate-600"
                        onClick={() => onView(p.id)}
                      >
                        {p.title || p.type}
                      </span>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                        {p.type} · {carrier ? carrier.company || carrier.firstName : "Private"} ·{" "}
                        {p.policyNumber}
                      </p>
                    </div>
                  </div>
                );
              },
            },
            {
              id: "limit",
              header: "Limit",
              sortable: true,
              sortKey: "coverageLimit",
              cell: (p) => <span className="text-sm font-black text-slate-800">{formatCurrency(p.coverageLimit)}</span>,
            },
            {
              id: "premium",
              header: "Premium / Ded..",
              cell: (p) => (
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-black text-xs">
                    <span>
                      {formatCurrency(p.premium, { maximumFractionDigits: 0 })}
                      /mo
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                    Ded: {formatCurrency(p.deductible, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              ),
            },
            {
              id: "incidents",
              header: "Incidents",
              cell: (p) => {
                const totalRecovered = p.claims?.reduce((acc, c) => acc + (c.payoutAmount || 0), 0) || 0;
                return totalRecovered > 0 ? (
                  <div className="flex items-center space-x-2 text-[#5a6b5d]">
                    <TrendingUp size={12} strokeWidth={3} />
                    <span className="text-xs font-black">+{formatCurrency(totalRecovered)}</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-slate-300 uppercase">None logged</span>
                );
              },
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (p) => <RowActionsMenu onView={() => onView(p.id)} />,
            },
          ]}
        />

        <Pagination
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalItems={processedItems.length}
          onPageChange={setCurrentPage}
        />
      </Card>

      <InsurancePolicyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPolicy(null);
        }}
        availableContacts={contacts}
        initialData={editingPolicy}
        onQuickAddContact={onQuickAddContact}
        onSave={(data) => {
          const id = onUpsert(data, editingPolicy?.id);
          setIsModalOpen(false);
          setEditingPolicy(null);
          onView(id);
        }}
      />
    </div>
  );
};

export default InsuranceList;

