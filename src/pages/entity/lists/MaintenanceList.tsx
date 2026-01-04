import React, { useMemo, useState } from "react";
import { MapPin, Plus, Repeat, Search } from "lucide-react";
import type {
  Contact,
  InventoryItem,
  MaintenanceRecurrenceFrequency,
  MaintenanceTask,
  MaintenanceTaskPriority,
  Space,
  Tag,
} from "../../../types";
import MaintenanceTaskModal from "@/features/maintenance/components/MaintenanceTaskModal";
import {
  Badge,
  Button,
  Card,
  DataTable,
  PageHeader,
  Pagination,
  RowActionsMenu,
} from "@/components/ui";

interface MaintenanceListProps {
  tasks: MaintenanceTask[];
  spaces: Space[];
  availableTags: Tag[];
  availableInventory: InventoryItem[];
  availableContacts: Contact[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (data: Partial<MaintenanceTask>) => string;
}

const MaintenanceList: React.FC<MaintenanceListProps> = ({
  tasks,
  spaces,
  availableInventory,
  availableContacts,
  onView,
  onCreate,
}) => {
  const [filter, setFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof MaintenanceTask; direction: "asc" | "desc" }>({
    key: "dueDateUtc",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key: keyof MaintenanceTask) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    const filtered = tasks.filter((t) => t.title.toLowerCase().includes(filter.toLowerCase()));
    const priorityWeight: Record<MaintenanceTaskPriority, number> = {
      Urgent: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    return filtered.sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];
      if (sortConfig.key === "priority") {
        aValue = priorityWeight[a.priority as MaintenanceTaskPriority] || 0;
        bValue = priorityWeight[b.priority as MaintenanceTaskPriority] || 0;
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, filter, sortConfig]);

  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPriorityColor = (p: MaintenanceTaskPriority) => {
    switch (p) {
      case "Urgent":
        return { color: "text-[#b45c43]", bg: "bg-[#fdf3f0]", border: "border-[#f9dad3]" };
      case "High":
        return { color: "text-[#a47148]", bg: "bg-[#f9f4f0]", border: "border-[#f1e6df]" };
      case "Medium":
        return { color: "text-[#5a6b5d]", bg: "bg-[#f2f4f2]", border: "border-[#e1e6e1]" };
      default:
        return { color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" };
    }
  };

  const getSpacesSummary = (spaceIds: string[]) => {
    if (!spaceIds || spaceIds.length === 0) return "Global Property";
    const firstSpace = spaces.find((s) => s.id === spaceIds[0]);
    if (!firstSpace) return "Global Property";
    if (spaceIds.length === 1) return firstSpace.name;
    return `${firstSpace.name} + ${spaceIds.length - 1} others`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Maintenance"
        description="Track and schedule property upkeep."
        action={
          <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
            New Task
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
              placeholder="Search maintenance logs..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>

        <DataTable<MaintenanceTask>
          rows={paginatedItems}
          getRowKey={(row) => row.id}
          sort={{ key: sortConfig.key as any, direction: sortConfig.direction }}
          onSort={(key) => handleSort(key as any)}
          columns={[
            {
              id: "title",
              header: "Task Details",
              sortable: true,
              sortKey: "title",
              cell: (t) => {
                const isRecurring =
                  Boolean(t.recurrence) &&
                  (t.recurrence!.frequency as MaintenanceRecurrenceFrequency) !== "None";
                return (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span
                        className="font-black text-slate-900 text-xl cursor-pointer hover:text-slate-600 transition-colors tracking-tight"
                        onClick={() => onView(t.id)}
                      >
                        {t.title}
                      </span>
                      {isRecurring && <Repeat size={14} className="text-[#a47148]" strokeWidth={3} />}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-[9px] font-black text-[#5a6b5d] uppercase tracking-widest">
                        <MapPin size={10} className="mr-1" />
                        <span>{getSpacesSummary(t.spaceIds)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {t.tags?.map((tagName) => (
                          <span
                            key={tagName}
                            className="px-2 py-0.5 rounded-lg text-[9px] font-bold border border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tight"
                          >
                            {tagName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              },
            },
            {
              id: "priority",
              header: "Priority",
              sortable: true,
              sortKey: "priority",
              cell: (t) => {
                const styles = getPriorityColor(t.priority as MaintenanceTaskPriority);
                return (
                  <Badge color={styles.color} bgColor={styles.bg} borderColor={styles.border}>
                    {t.priority}
                  </Badge>
                );
              },
            },
            {
              id: "cost",
              header: "Est. Cost",
              cell: (t) => (
                <span className="text-sm font-black text-slate-800">
                  {t.estimatedCost?.toLocaleString() || "-"} kr
                </span>
              ),
            },
            {
              id: "dueDate",
              header: "Due Date",
              sortable: true,
              sortKey: "dueDateUtc",
              cell: (t) => (
                <span className="text-sm font-bold text-slate-500">
                  {t.dueDateUtc ? new Date(t.dueDateUtc).toLocaleDateString() : "-"}
                </span>
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

      <MaintenanceTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          const id = onCreate(data);
          setIsModalOpen(false);
          onView(id);
        }}
        initialData={null}
        availableSpaces={spaces}
        availableContacts={availableContacts}
        availableInventory={availableInventory}
      />
    </div>
  );
};

export default MaintenanceList;

