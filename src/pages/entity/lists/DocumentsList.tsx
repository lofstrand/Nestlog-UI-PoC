import React, { useMemo, useState } from "react";
import { FileText, Link, Plus, Search, Shield } from "lucide-react";
import type { Contact, Document, InventoryItem, MaintenanceTask, Project, Space, Tag } from "../../../types";
import DocumentModal from "@/features/documents/components/DocumentModal";
import DocumentPreview from "@/features/documents/components/DocumentPreview";
import {
  Badge,
  Button,
  Card,
  DataTable,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface DocumentsListProps {
  documents: Document[];
  spaces: Space[];
  inventory: InventoryItem[];
  projects: Project[];
  tasks: MaintenanceTask[];
  contacts: Contact[];
  availableTags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (data: Partial<Document>) => string;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  spaces,
  inventory,
  projects,
  tasks,
  contacts,
  onView,
  onCreate,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Document; direction: "asc" | "desc" }>({
    key: "title",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleSort = (key: keyof Document) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = documents.filter((d) => d.title.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [documents, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLinkCount = (doc: Document) => {
    return (
      (doc.projectIds?.length || 0) +
      (doc.taskIds?.length || 0) +
      (doc.inventoryItems?.length || 0) +
      (doc.surfaceIds?.length || 0)
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Documents"
        description="A safe place for your receipts, warranties, and property manuals."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New Document
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
              placeholder="Search by document name..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<Document>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "title",
              header: "Document Name",
              sortable: true,
              sortKey: "title",
              cell: (d) => (
                <div className="flex items-center space-x-4">
                  {d.attachments && d.attachments.length > 0 ? (
                    <DocumentPreview
                      attachment={d.attachments[0]}
                      size="md"
                      className="shadow-lg transition-transform"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        d.isPrivate
                          ? "bg-[#b45c43] text-white shadow-lg shadow-[#b45c43]/20"
                          : "bg-slate-100 border border-slate-200 text-slate-400 shadow-sm"
                      }`}
                    >
                      {d.isPrivate ? <Shield size={20} /> : <FileText size={20} />}
                    </div>
                  )}
                  <div>
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight"
                      onClick={() => onView(d.id)}
                    >
                      {d.title}
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      {d.isPrivate && (
                        <Badge color="text-white" bgColor="bg-[#b45c43]" borderColor="border-[#b45c43]">
                          Private
                        </Badge>
                      )}
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Added {new Date(d.createdAtUtc).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "category",
              header: "Category",
              sortable: true,
              sortKey: "category",
              cell: (d) => (
                <Badge color="text-slate-400" bgColor="bg-slate-50" borderColor="border-slate-100">
                  {d.category || "Uncategorized"}
                </Badge>
              ),
            },
            {
              id: "links",
              header: "Associated Items",
              cell: (d) => (
                <div className="flex items-center space-x-1.5 text-slate-400 font-black text-[10px]">
                  <Link size={12} />
                  <span>{getLinkCount(d)} Links</span>
                </div>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (d) => <RowActionsMenu onView={() => onView(d.id)} />,
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

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        availableSpaces={spaces}
        availableInventory={inventory}
        availableProjects={projects}
        availableTasks={tasks}
        availableContacts={contacts}
      />
    </div>
  );
};

export default DocumentsList;

