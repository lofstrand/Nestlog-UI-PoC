import React, { useMemo, useState } from "react";
import { Home, MapPin, Plus, Search, Star } from "lucide-react";
import type { Property, Tag } from "../../../types";
import PropertyModal from "@/features/properties/components/PropertyModal";
import { Button, Card, DataTable, PageHeader, Pagination, RowActionsMenu } from "@/components/ui";

interface PropertiesListProps {
  properties: Property[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onUpsert: (data: Partial<Property>, id?: string) => string;
}

const PropertiesList: React.FC<PropertiesListProps> = ({
  properties,
  availableTags,
  onView,
  onUpsert,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Property; direction: "asc" | "desc" }>({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key: keyof Property) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = properties.filter(
      (p) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.address.line1.toLowerCase().includes(filter.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [properties, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Properties"
        description="Manage the real estate assets within your active household."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditingProperty(null);
              setIsModalOpen(true);
            }}
          >
            New property
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
              placeholder="Filter properties..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<Property>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "details",
              header: "Asset Details",
              sortable: true,
              sortKey: "name",
              cell: (p) => (
                <div className="flex items-start space-x-4">
                  <div
                    className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      p.isPrimaryResidence
                        ? "bg-amber-50 border-amber-100 text-amber-600"
                        : "bg-slate-50 border-slate-100 text-slate-400"
                    }`}
                  >
                    {p.isPrimaryResidence ? (
                      <Star size={20} className="fill-amber-600" />
                    ) : (
                      <Home size={20} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block"
                      onClick={() => onView(p.id)}
                    >
                      {p.name}
                    </span>
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      <MapPin size={12} className="mr-1 opacity-50" />
                      <span>
                        {p.address.line1}, {p.address.city}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {p.tags?.map((tagName) => {
                        const tagDef = availableTags.find((t) => t.name === tagName);
                        const color = tagDef?.colorHex || "#1e293b";
                        return (
                          <span
                            key={tagName}
                            className="px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-tight"
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
                </div>
              ),
            },
            {
              id: "year",
              header: "Year",
              sortable: true,
              sortKey: "constructionYear",
              cell: (p) => (
                <span className="text-sm font-black text-slate-800">{p.constructionYear || "-"}</span>
              ),
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

      <PropertyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProperty(null);
        }}
        onSave={(data) => {
          const id = onUpsert(data, editingProperty?.id);
          setIsModalOpen(false);
          setEditingProperty(null);
          onView(id);
        }}
        initialData={editingProperty}
      />
    </div>
  );
};

export default PropertiesList;

