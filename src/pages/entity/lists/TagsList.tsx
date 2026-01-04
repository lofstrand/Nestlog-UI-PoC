import React, { useMemo, useState } from "react";
import { BarChart2, Plus, Search } from "lucide-react";
import type { Tag } from "../../../types";
import TagModal from "@/features/tags/components/TagModal";
import {
  Button,
  Card,
  DataTable,
  DynamicIcon,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface TagsListProps {
  tags: Tag[];
  usageByName?: Record<string, number>;
  onRefresh: () => void;
  onView: (id: string) => void;
  onCreate: (data: Partial<Tag>) => string;
}

const TagsList: React.FC<TagsListProps> = ({ tags, usageByName, onView, onCreate }) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tag; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: keyof Tag) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = tags.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const key = sortConfig.key as any;
      const aValue =
        key === "usageCount"
          ? (usageByName?.[a.name] ?? 0)
          : ((a[sortConfig.key] || "") as string | number);
      const bValue =
        key === "usageCount"
          ? (usageByName?.[b.name] ?? 0)
          : ((b[sortConfig.key] || "") as string | number);
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filter, sortConfig, tags, usageByName]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Index Tags"
        description="Global cross-referencing system for unified data classification."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New index tag
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
              placeholder="Filter global index..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<Tag>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "name",
              header: "Label Identity",
              sortable: true,
              sortKey: "name",
              cell: (t) => (
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"
                    style={{ backgroundColor: t.colorHex || "#1e293b" }}
                  >
                    <DynamicIcon name={t.iconName || "Tag"} size={18} />
                  </div>
                  <div>
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight"
                      onClick={() => onView(t.id)}
                    >
                      {t.name}
                    </span>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 truncate max-w-xs">
                      {t.description || "No usage guidelines"}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              id: "usage",
              header: "Usage Intensity",
              sortable: true,
              sortKey: "usageCount" as any,
              cell: (t) => (
                <div className="flex items-center space-x-2">
                  <BarChart2 size={14} className="text-slate-300" />
                  <span className="text-sm font-black text-slate-800">
                    {usageByName?.[t.name] ?? 0} Entities
                  </span>
                </div>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (t) => <RowActionsMenu onView={() => onView(t.id)} />,
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

      <TagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        initialData={null}
      />
    </div>
  );
};

export default TagsList;

