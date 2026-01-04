import React, { useMemo, useState } from "react";
import { Layers, Plus, Search, ShieldAlert } from "lucide-react";
import type { InventoryCategory } from "../../../types";
import InventoryCategoryModal from "@/features/inventoryCategories/components/InventoryCategoryModal";
import {
  Badge,
  Button,
  Card,
  DataTable,
  DynamicIcon,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface InventoryCategoriesListProps {
  categories: InventoryCategory[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onCreate: (data: Partial<InventoryCategory>) => string;
}

const InventoryCategoriesList: React.FC<InventoryCategoriesListProps> = ({
  categories,
  onView,
  onCreate,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryCategory; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: keyof InventoryCategory) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = categories.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [categories, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Classifications"
        description="Global taxonomy rules for inventory assets and belongings."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New classification
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
              placeholder="Filter classification portfolio..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<InventoryCategory>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "identity",
              header: "Classification Identity",
              sortable: true,
              sortKey: "name",
              cell: (c) => (
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                    style={{ backgroundColor: c.colorHex || "#1e293b" }}
                  >
                    <DynamicIcon name={c.iconName || "LayoutGrid"} size={18} />
                  </div>
                  <div>
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight"
                      onClick={() => onView(c.id)}
                    >
                      {c.name}
                    </span>
                    {c.parentId && (
                      <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <Layers size={10} />
                        <span>
                          Child of {categories.find((pc) => pc.id === c.parentId)?.name || "Unlinked"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ),
            },
            {
              id: "sequence",
              header: "Sequence",
              sortable: true,
              sortKey: "sortOrder",
              cell: (c) => (
                <span className="text-sm font-black text-slate-800 tracking-tighter">
                  ORD-{c.sortOrder.toString().padStart(3, "0")}
                </span>
              ),
            },
            {
              id: "flags",
              header: "Protocol Flags",
              cell: (c) => (
                <div className="flex items-center space-x-2">
                  {c.isInsuranceCritical && (
                    <Badge color="text-[#b45c43]" bgColor="bg-[#fdf3f0]" borderColor="border-[#f9dad3]">
                      <div className="flex items-center space-x-1">
                        <ShieldAlert size={10} />
                        <span>Insurance Critical</span>
                      </div>
                    </Badge>
                  )}
                  {c.estimatedDepreciationRate && (
                    <Badge color="text-[#a47148]" bgColor="bg-[#f9f4f0]">
                      -{c.estimatedDepreciationRate}% DEP
                    </Badge>
                  )}
                  {(c.canHaveChildren ?? true) === false && (
                    <Badge color="text-slate-500" bgColor="bg-slate-50" borderColor="border-slate-100">
                      Leaf
                    </Badge>
                  )}
                </div>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (c) => <RowActionsMenu onView={() => onView(c.id)} />,
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

      <InventoryCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        initialData={null}
        availableCategories={categories}
      />
    </div>
  );
};

export default InventoryCategoriesList;

