import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Briefcase,
  Mail,
  Phone,
  StickyNote,
  Globe,
  Star,
  Siren,
  DollarSign,
  Hammer,
  Award,
  HardHat,
  ShieldAlert,
} from "lucide-react";
import { Contact, Tag, ContactCategory } from "../types";
import { Input, SectionHeading } from "./UIPrimitives";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Contact>) => void;
  initialData?: Contact | null;
  availableTags: Tag[];
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

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  availableTags,
}) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [category, setCategory] = useState<ContactCategory>("Other");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hourlyRate, setHourlyRate] = useState("");
  const [specialtiesText, setSpecialtiesText] = useState("");
  const [certificationId, setCertificationId] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setSurname(initialData.surname);
      setCompany(initialData.company || "");
      setJobTitle(initialData.jobTitle || "");
      setCategory(initialData.category || "Other");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setWebsiteUrl(initialData.websiteUrl || "");
      setIsEmergencyContact(initialData.isEmergencyContact || false);
      setRating(initialData.rating ?? null);
      setHourlyRate(initialData.hourlyRate?.toString() || "");
      setSpecialtiesText(initialData.specialties?.join(", ") || "");
      setCertificationId(initialData.certificationId || "");
      setNotes(initialData.notes?.[0]?.text || "");
      setSelectedTags(initialData.tags || []);
    } else {
      setFirstName("");
      setSurname("");
      setCompany("");
      setJobTitle("");
      setCategory("Other");
      setEmail("");
      setPhone("");
      setWebsiteUrl("");
      setIsEmergencyContact(false);
      setRating(null);
      setHourlyRate("");
      setSpecialtiesText("");
      setCertificationId("");
      setNotes("");
      setSelectedTags([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      firstName,
      surname,
      company: company || null,
      jobTitle: jobTitle || null,
      category,
      email: email || null,
      phone: phone || null,
      websiteUrl: websiteUrl || null,
      isEmergencyContact,
      rating,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      specialties: specialtiesText
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
      certificationId: certificationId || null,
      notes: notes
        ? [
            {
              id: Math.random().toString(36).substr(2, 9),
              text: notes,
              createdAtUtc: new Date().toISOString(),
            },
          ]
        : [],
      tags: selectedTags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                {initialData ? "Edit Contact" : "Add New Contact"}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Household Registry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-10"
        >
          <div className="space-y-6">
            <SectionHeading label="Core Identity" icon={User} />
            <div className="grid grid-cols-2 gap-6">
              <Input
                autoFocus
                label="Given Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Registry Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-sm font-bold text-slate-900 shadow-inner"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/([A-Z])/g, " $1").trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <SectionHeading label="Communication Hub" icon={Mail} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Registry Email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
              />
              <Input
                label="Direct Line"
                icon={Phone}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 000 000 0000"
              />
            </div>
            <Input
              label="Digital Domain / Portal"
              icon={Globe}
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[1.5rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Siren size={80} className="text-white" />
              </div>
              <div className="flex items-start space-x-3 relative z-10">
                <div
                  className={`p-2 rounded-xl shadow-sm ${
                    isEmergencyContact
                      ? "bg-[#b45c43] text-white animate-pulse"
                      : "bg-slate-800 text-slate-600"
                  }`}
                >
                  <Siren size={16} />
                </div>
                <div>
                  <p className="text-sm font-black text-white leading-none">
                    Emergency Priority
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest">
                    Pin to rapid dispatch dashboard.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyContact(!isEmergencyContact)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none z-10 ${
                  isEmergencyContact ? "bg-[#b45c43]" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEmergencyContact ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <SectionHeading label="Commercial Data" icon={Briefcase} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Operating Entity"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Plumbing Ltd."
              />
              <Input
                label="Professional Role"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Master Electrician"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <Star size={10} className="mr-1.5" /> Performance Audit
                  </label>
                  {rating !== null && (
                    <button
                      type="button"
                      onClick={() => setRating(null)}
                      className="text-[9px] font-black text-rose-600 uppercase hover:underline"
                    >
                      Clear Rating
                    </button>
                  )}
                </div>
                {rating !== null ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setRating(i + 1)}
                        >
                          <Star
                            size={24}
                            className={
                              i < rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Score: {rating}.0 / 5.0
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRating(5)}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all bg-white"
                  >
                    Set Service Rating
                  </button>
                )}
              </div>
              <Input
                label="Hourly Engagement Rate"
                icon={DollarSign}
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <SectionHeading label="Capabilities & Credentials" icon={Hammer} />
            <Input
              label="Technical Specialties"
              icon={Award}
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="e.g. Plumbing, HVAC, Smart Home (comma separated)"
            />
            <Input
              label="Professional License / Certification ID"
              icon={HardHat}
              value={certificationId}
              onChange={(e) => setCertificationId(e.target.value)}
              placeholder="e.g. LIC-992-B"
            />
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[1.5rem] flex items-start space-x-4">
              <HardHat size={20} className="text-indigo-600 mt-1" />
              <div className="space-y-2">
                <p className="text-sm font-black text-indigo-900 tracking-tight leading-none">
                  Compliance Management
                </p>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                  Capture license numbers and technical domains to automate
                  vendor verification during project planning.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <SectionHeading label="Internal Registry Logs" icon={StickyNote} />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private audit notes about reliability, site access codes, or historical performance..."
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 leading-relaxed focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all resize-none shadow-inner"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-slate-900 text-white text-sm font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-xl shadow-slate-200 transition-all active:scale-95"
            >
              {initialData ? "Update Contact" : "Save Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
