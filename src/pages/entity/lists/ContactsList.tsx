import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Siren,
  Mail,
  Phone,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Contact, Tag, ContactCategory } from "../../../types";
import ContactModal from "@/features/contacts/components/ContactModal";
import { Button, Card, PageHeader, Badge } from "@/components/ui";

interface ContactsListProps {
  contacts: Contact[];
  tags: Tag[];
  onRefresh: () => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: ContactCategory[] = [
  "ServiceProvider",
  "Agency",
  "InsuranceCarrier",
  "Contractor",
  "Vendor",
  "Tenant",
  "Owner",
  "Family",
  "Neighbor",
  "Other",
];

const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  tags,
  onRefresh,
  onView,
  onDelete,
}) => {
  const [filter, setFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState<ContactCategory | "All">(
    "All"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contact;
    direction: "asc" | "desc";
  }>({ key: "firstName", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleSort = (key: keyof Contact) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const processedItems = useMemo(() => {
    let filtered = contacts.filter((c) => {
      const matchesSearch =
        `${c.firstName} ${c.surname}`
          .toLowerCase()
          .includes(filter.toLowerCase()) ||
        (c.company || "").toLowerCase().includes(filter.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      const aValue = (a[sortConfig.key] || "") as string | number;
      const bValue = (b[sortConfig.key] || "") as string | number;
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [contacts, filter, activeCategory, sortConfig]);

  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const paginatedItems = processedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ column }: { column: keyof Contact }) => {
    if (sortConfig.key !== column)
      return (
        <ChevronUp size={14} className="opacity-0 group-hover:opacity-30" />
      );
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="text-slate-900" />
    ) : (
      <ChevronDown size={14} className="text-slate-900" />
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        title="Contacts"
        description="Unified index of professional service providers and personal collaborators."
        action={
          <Button
            icon={Plus}
            onClick={() => {
              setEditingContact(null);
              setIsModalOpen(true);
            }}
          >
            New contact
          </Button>
        }
      />

      <div className="flex items-center space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
            activeCategory === "All"
              ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
              : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
          }`}
        >
          Entire Index
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
            }`}
          >
            {cat.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 bg-slate-50/20">
          <div className="relative group max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-800"
            />
            <input
              type="text"
              placeholder="Filter by name or company..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 transition-all shadow-inner"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4">
                  <button
                    onClick={() => handleSort("firstName")}
                    className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                  >
                    Collaborator Details <SortIcon column="firstName" />
                  </button>
                </th>
                <th className="px-8 py-4">
                  <button
                    onClick={() => handleSort("company")}
                    className="group flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                  >
                    Affiliation & Portal <SortIcon column="company" />
                  </button>
                </th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/50 transition-colors group/row"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg ${
                          c.isEmergencyContact
                            ? "bg-[#b45c43] shadow-[#b45c43]/20"
                            : "bg-slate-800 shadow-slate-200"
                        }`}
                      >
                        {c.firstName[0]}
                        {c.surname[0]}
                        {c.isEmergencyContact && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[#b45c43] border border-[#b45c43] ring-2 ring-white animate-pulse">
                            <Siren size={8} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-black text-slate-900 text-lg cursor-pointer hover:text-indigo-600 transition-colors tracking-tight block leading-tight truncate"
                            onClick={() => onView(c.id)}
                          >
                            {c.firstName} {c.surname}
                          </span>
                          <Badge
                            color="text-slate-400"
                            bgColor="bg-slate-50"
                            className="px-1.5 py-0.5 scale-90"
                          >
                            {c.category?.replace(/([A-Z])/g, " $1").trim() ||
                              "Entry"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3 mt-1 text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Mail
                              size={10}
                              className={
                                c.email ? "text-indigo-400" : "text-slate-200"
                              }
                            />
                            <span className="text-[10px] font-bold truncate max-w-[150px]">
                              {c.email || "—"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone
                              size={10}
                              className={
                                c.phone ? "text-emerald-400" : "text-slate-200"
                              }
                            />
                            <span className="text-[10px] font-bold">
                              {c.phone || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      {c.jobTitle && (
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          {c.jobTitle}
                        </p>
                      )}
                      <div className="flex items-center space-x-2">
                        {c.websiteUrl ? (
                          <a
                            href={c.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/link flex items-center space-x-1.5"
                          >
                            <span className="text-sm font-black text-slate-800 tracking-tight hover:text-indigo-600 transition-colors">
                              {c.company || "Visit Portal"}
                            </span>
                            <ExternalLink
                              size={12}
                              className="text-slate-300 group-hover/link:text-indigo-400 transition-colors"
                            />
                          </a>
                        ) : (
                          <span className="text-sm font-black text-slate-800 tracking-tight">
                            {c.company || "Private Professional"}
                          </span>
                        )}
                        {c.websiteUrl && (
                          <Globe size={12} className="text-slate-200" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => onView(c.id)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, processedItems.length)} of{" "}
              {processedItems.length}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="white"
                size="sm"
                icon={ChevronLeft}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              <Button
                variant="white"
                size="sm"
                icon={ChevronRight}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              />
            </div>
          </div>
        )}
      </Card>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => setIsModalOpen(false)}
        initialData={editingContact}
        availableTags={tags}
      />
    </div>
  );
};

export default ContactsList;
