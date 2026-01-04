import React, { useMemo, useState } from "react";
import { Box, Plus, Search } from "lucide-react";
import type { InventoryCategory, InventoryItem, InventoryItemStatus, Space, Tag } from "../../../types";
import InventoryModal from "@/features/inventory/components/InventoryModal";
import { usePreferences } from "@/contexts/PreferencesContext";
import {
  Badge,
  Button,
  Card,
  DataTable,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface InventoryListProps {
  items: InventoryItem[];
  spaces: Space[];
  categories: InventoryCategory[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onCreate: (data: Partial<InventoryItem>) => string;
}

const InventoryList: React.FC<InventoryListProps> = ({
  items,
  spaces,
  categories,
  onView,
  onCreate,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { formatCurrency } = usePreferences();

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: InventoryItemStatus) => {
    switch (status) {
      case "Excellent":
        return (
          <Badge color="text-[#5a6b5d]" bgColor="bg-[#f2f4f2]" borderColor="border-[#e1e6e1]">
            Excellent
          </Badge>
        );
      case "Fair":
        return (
          <Badge color="text-[#a47148]" bgColor="bg-[#f9f4f0]" borderColor="border-[#f1e6df]">
            Fair
          </Badge>
        );
      case "Broken":
        return (
          <Badge color="text-[#b45c43]" bgColor="bg-[#fdf3f0]" borderColor="border-[#f9dad3]">
            Broken
          </Badge>
        );
      default:
        return (
          <Badge color="text-slate-500" bgColor="bg-slate-50">
            Good
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Inventory"
        description="Global catalog of household belongings, equipment, and valuables."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New item
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
              placeholder="Search inventory..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<InventoryItem>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "identity",
              header: "Item / Identity",
              sortable: true,
              sortKey: "name",
              cell: (item) => (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm transition-all">
                    <Box size={20} />
                  </div>
                  <div>
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight"
                      onClick={() => onView(item.id)}
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                        {spaces.find((s) => s.id === item.spaceId)?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "condition",
              header: "Condition",
              sortable: true,
              sortKey: "status",
              cell: (item) => getStatusBadge(item.status as InventoryItemStatus),
            },
            {
              id: "stock",
              header: "Stock & Category",
              cell: (item) => (
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-900 font-black text-sm">
                    <span className="text-[#1a2e4c]">x{item.quantity}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{item.unit}</span>
                  </div>
                  <Badge color="text-slate-400" bgColor="bg-slate-50" borderColor="border-slate-100">
                    {item.category}
                  </Badge>
                </div>
              ),
            },
            {
              id: "value",
              header: "Value",
              cell: (item) => (
                <div className="text-sm font-black text-slate-900">
                  {formatCurrency(item.value ?? item.purchasePrice ?? null)}
                </div>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (item) => <RowActionsMenu onView={() => onView(item.id)} />,
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

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        initialData={null}
        availableSpaces={spaces}
        availableCategories={categories}
      />
    </div>
  );
};

export default InventoryList;

