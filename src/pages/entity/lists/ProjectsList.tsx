import React, { useMemo, useState } from "react";
import { FolderOpen, MapPin, Plus, Search } from "lucide-react";
import type { Contact, Project, Space, Tag } from "../../../types";
import ProjectModal from "@/features/projects/components/ProjectModal";
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

interface ProjectsListProps {
  projects: Project[];
  availableTags: Tag[];
  availableSpaces: Space[];
  availableContacts: Contact[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (data: Partial<Project>) => string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  availableTags,
  availableSpaces,
  availableContacts,
  onView,
  onCreate,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Project; direction: "asc" | "desc" }>({
    key: "title",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { formatCurrency } = usePreferences();

  const handleSort = (key: keyof Project) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = projects.filter((p) => p.title.toLowerCase().includes(filter.toLowerCase()));

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [projects, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSpacesSummary = (spaceIds: string[]) => {
    if (!spaceIds || spaceIds.length === 0) return "Global Property";
    const firstSpace = availableSpaces.find((s) => s.id === spaceIds[0]);
    if (!firstSpace) return "Global Property";
    if (spaceIds.length === 1) return firstSpace.name;
    return `${firstSpace.name} + ${spaceIds.length - 1} more`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Projects"
        description="Comprehensive planning and financial oversight for property upgrades."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New project
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
              placeholder="Search project portfolio..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<Project>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "title",
              header: "Initiative Identity",
              sortable: true,
              sortKey: "title",
              cell: (p) => (
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                    <FolderOpen size={20} />
                  </div>
                  <div>
                    <span
                      className="font-black text-slate-900 text-lg cursor-pointer hover:text-slate-600 transition-colors tracking-tight block leading-tight"
                      onClick={() => onView(p.id)}
                    >
                      {p.title}
                    </span>
                    <div className="flex items-center space-x-3 mt-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Commenced: {p.startDate || "Unscheduled"}
                      </p>
                      <div className="flex items-center text-[10px] font-black text-[#5a6b5d] uppercase tracking-widest">
                        <MapPin size={10} className="mr-1" />
                        <span>{getSpacesSummary(p.spaceIds)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags?.map((tagName) => {
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
              id: "status",
              header: "Lifecycle",
              sortable: true,
              sortKey: "status",
              cell: (p) => <Badge>{p.status}</Badge>,
            },
            {
              id: "burn",
              header: "Financial Burn",
              cell: (p) => (
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-black text-slate-900">
                      {formatCurrency(p.actualCost || 0)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      / {formatCurrency(p.budget || 0)}
                    </span>
                  </div>
                  <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (p.actualCost || 0) > (p.budget || 0) ? "bg-[#b45c43]" : "bg-[#5a6b5d]"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          ((p.actualCost || 0) / (p.budget || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
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

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        initialData={null}
        availableSpaces={availableSpaces}
        availableContacts={availableContacts}
      />
    </div>
  );
};

export default ProjectsList;

