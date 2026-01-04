import React, { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import type { Household, Tag } from "../../../types";
import HouseholdModal from "@/features/households/components/HouseholdModal";
import {
  Badge,
  Button,
  Card,
  DataTable,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface HouseholdsListProps {
  households: Household[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onUpsert: (data: Partial<Household>, id?: string) => string;
}

const HouseholdsList: React.FC<HouseholdsListProps> = ({ households, availableTags, onView, onUpsert }) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Household; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key: keyof Household) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = households.filter(
      (h) =>
        h.name.toLowerCase().includes(filter.toLowerCase()) ||
        h.description.toLowerCase().includes(filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] as any;
      const bValue = b[sortConfig.key] as any;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [households, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Households"
        description="Active managed workspaces for your properties."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditingHousehold(null);
              setIsModalOpen(true);
            }}
          >
            New household
          </Button>
        }
      />

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800"
            />
            <input
              type="text"
              placeholder="Filter households..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all text-slate-900 shadow-inner"
            />
          </div>
        </div>

        <DataTable<Household>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "identity",
              header: "Identity",
              sortable: true,
              sortKey: "name",
              cell: (h) => (
                <div className="space-y-2">
                  <span
                    className="font-black text-slate-900 text-xl cursor-pointer hover:text-slate-600 transition-colors tracking-tight block"
                    onClick={() => onView(h.id)}
                  >
                    {h.name}
                  </span>
                  <p className="text-sm text-slate-500 line-clamp-1 max-w-2xl font-medium">
                    {h.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {h.tags?.map((tagName) => {
                      const tagDef = availableTags.find((t) => t.name === tagName);
                      const color = tagDef?.colorHex || "#1e293b";
                      return (
                        <span
                          key={tagName}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tight"
                          style={{
                            backgroundColor: `${color}08`,
                            color,
                            borderColor: `${color}20`,
                          }}
                        >
                          {tagName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ),
            },
            {
              id: "status",
              header: "Status",
              sortable: true,
              sortKey: "status",
              cell: (h) => (
                <Badge
                  color={h.status === "Active" ? "text-[#5a6b5d]" : "text-slate-400"}
                  bgColor={h.status === "Active" ? "bg-[#f2f4f2]" : "bg-slate-50"}
                  borderColor={h.status === "Active" ? "border-[#e1e6e1]" : "border-slate-200"}
                >
                  {h.status}
                </Badge>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (h) => <RowActionsMenu onView={() => onView(h.id)} />,
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

      <HouseholdModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHousehold(null);
        }}
        onSave={(data) => {
          const id = onUpsert(data, editingHousehold?.id);
          setIsModalOpen(false);
          setEditingHousehold(null);
          onView(id);
        }}
        initialData={editingHousehold}
      />
    </div>
  );
};

export default HouseholdsList;

