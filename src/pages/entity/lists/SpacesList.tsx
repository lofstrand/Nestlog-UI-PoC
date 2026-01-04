import React, { useMemo, useState } from "react";
import { Layout, Plus, Search } from "lucide-react";
import type { Document, Space, Tag } from "../../../types";
import SpaceModal from "@/features/spaces/components/SpaceModal";
import {
  Badge,
  Button,
  Card,
  DataTable,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface SpacesListProps {
  spaces: Space[];
  availableTags: Tag[];
  availableDocuments: Document[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (data: Partial<Space>) => string;
}

const SpacesList: React.FC<SpacesListProps> = ({
  spaces,
  availableTags,
  availableDocuments,
  onView,
  onCreate,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSpaces = useMemo(
    () => spaces.filter((s) => s.name.toLowerCase().includes(filter.toLowerCase())),
    [spaces, filter]
  );

  const paginatedItems = filteredSpaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Spaces"
        description="Categorize rooms and outdoor zones for precise asset management."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New space
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
              placeholder="Filter spaces..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<Space>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          columns={[
            {
              id: "identity",
              header: "Identity & Classification",
              cell: (s) => (
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 transition-colors">
                    <Layout size={20} />
                  </div>
                  <div className="space-y-1">
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors block leading-tight"
                      onClick={() => onView(s.id)}
                    >
                      {s.name}
                    </span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {s.spaceType} · Level {s.level}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {s.tags?.map((tagName) => {
                        const tagDef = availableTags.find((t) => t.name === tagName);
                        const color = tagDef?.colorHex || "#1e293b";
                        return (
                          <span
                            key={tagName}
                            className="px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-tight"
                            style={{
                              backgroundColor: `${color}08`,
                              color,
                              borderColor: `${color}15`,
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
              id: "env",
              header: "Environment",
              cell: (s) => (
                <Badge
                  color={s.isOutdoor ? "text-[#5a6b5d]" : "text-slate-500"}
                  bgColor={s.isOutdoor ? "bg-[#f2f4f2]" : "bg-slate-50"}
                >
                  {s.isOutdoor ? "Outdoor" : "Indoor"}
                </Badge>
              ),
            },
            {
              id: "actions",
              header: "Actions",
              align: "right",
              cell: (s) => <RowActionsMenu onView={() => onView(s.id)} />,
            },
          ]}
        />

        <Pagination
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalItems={filteredSpaces.length}
          onPageChange={setCurrentPage}
        />
      </Card>

      <SpaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        initialData={null}
        availableDocuments={availableDocuments}
      />
    </div>
  );
};

export default SpacesList;

