import React from "react";
import {
  LayoutDashboard,
  Home,
  Building2,
  Globe,
  Layers,
  Calendar,
  Library,
  ChevronLeft,
  ChevronRight,
  Layout,
  Wrench,
  FolderOpen,
  FileText,
  Users,
  Box,
  Tags,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Zap,
  DollarSign,
} from "lucide-react";
import { View } from "../types";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  variant?: "desktop" | "mobile";
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  toggleSidebar,
  variant = "desktop",
}) => {
  const isMobile = variant === "mobile";
  const expanded = isMobile ? true : isOpen;

  const menuItems = [
    { id: "landing", label: "Home", icon: Home },
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "workspace",
      label: "Workspace",
      icon: Layers,
      isExpandable: true,
      subItems: [
        { id: "households", label: "Households", icon: Home },
        { id: "properties", label: "Properties", icon: Building2 },
        { id: "spaces", label: "Spaces", icon: Layout },
      ],
    },
    {
      id: "planner",
      label: "Planner",
      icon: Calendar,
      isExpandable: true,
      subItems: [
        { id: "maintenance", label: "Maintenance", icon: Wrench },
        { id: "projects", label: "Projects", icon: FolderOpen },
      ],
    },
    {
      id: "finance",
      label: "Finance",
      icon: DollarSign,
      isExpandable: true,
      subItems: [
        { id: "insurance", label: "Insurance", icon: ShieldCheck },
        { id: "utilities", label: "Utilities", icon: Zap },
      ],
    },
    {
      id: "global",
      label: "Global",
      icon: Globe,
      isExpandable: true,
      subItems: [
        { id: "contacts", label: "Contacts", icon: Users },
        {
          id: "inventory_categories",
          label: "Inventory categories",
          icon: LayoutGrid,
        },
        { id: "tags", label: "Tags", icon: Tags },
      ],
    },
    {
      id: "library",
      label: "Library",
      icon: Library,
      isExpandable: true,
      subItems: [
        { id: "documents", label: "Documents", icon: FileText },
        { id: "inventory", label: "Inventory", icon: Box },
      ],
    },
  ];

  const isViewActive = (itemId: string, subItems?: any[]) => {
    if (currentView === itemId) return true;
    if (subItems?.some((s) => s.id === currentView)) return true;
    return false;
  };

  return (
    <aside
      className={`
        bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col relative h-screen
        ${isMobile ? "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl" : "z-20"}
        ${expanded ? (isMobile ? "" : "w-64") : "w-20"}
      `}
    >
      <div className="p-6 flex items-center space-x-3 overflow-hidden">
        <button
          onClick={() => setCurrentView("landing")}
          className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center shrink-0 hover:scale-105 transition-transform shadow-md"
        >
          <div className="w-4 h-4 bg-white rounded-sm"></div>
        </button>
        {expanded && (
          <div
            className="flex flex-col leading-tight whitespace-nowrap cursor-pointer"
            onClick={() => setCurrentView("landing")}
          >
            <span className="font-bold text-slate-900 tracking-tight">
              Nestlog
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              PRO EDITION
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
        <p
          className={`text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 ${
            !expanded && "text-center"
          }`}
        >
          {expanded ? "Main Dashboard" : ""}
        </p>

        {menuItems.map((item) => {
          const active = isViewActive(item.id, item.subItems);

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  setCurrentView(item.id as View);
                  if (isMobile) toggleSidebar();
                }}
                className={`
                  w-full flex items-center px-3 py-2 rounded-lg transition-colors group
                  ${
                    active
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <item.icon
                  size={18}
                  className={`shrink-0 ${active ? "text-slate-800" : ""}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {expanded && (
                  <span
                    className={`ml-3 text-sm flex-1 text-left ${
                      active ? "font-bold" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                {expanded && item.isExpandable && (
                  <ChevronRight
                    size={14}
                    className={`text-slate-300 group-hover:text-slate-600 transition-transform ${
                      active ? "rotate-90 text-slate-800" : ""
                    }`}
                  />
                )}
              </button>

              {expanded && item.subItems && (
                <div className="ml-4 pl-4 border-l border-slate-100 space-y-1 mt-1">
                  {item.subItems.map((sub: any) => {
                    const subActive = currentView === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentView(sub.id as View);
                          if (isMobile) toggleSidebar();
                        }}
                        className={`
                          w-full flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors
                          ${
                            subActive
                              ? "text-slate-900 font-bold bg-slate-50"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }
                        `}
                      >
                        <sub.icon
                          size={14}
                          className={`mr-2 shrink-0 ${
                            subActive ? "text-slate-800" : ""
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <button
          onClick={() => {
            setCurrentView("profile");
            if (isMobile) toggleSidebar();
          }}
          className={`
            w-full flex items-center px-3 py-2 rounded-lg transition-colors
            ${
              currentView === "profile"
                ? "bg-slate-50 text-slate-900 font-bold"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            }
          `}
        >
          <Settings size={18} className="shrink-0" />
          {expanded && <span className="ml-3 text-sm">Settings</span>}
        </button>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
