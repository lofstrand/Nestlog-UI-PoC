import React from 'react';
import { History } from 'lucide-react';
import { SectionHeading } from "../ui/UIPrimitives";

type MetadataRow = {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
};

interface SystemMetadataCardProps {
  rows: MetadataRow[];
}

const SystemMetadataCard: React.FC<SystemMetadataCardProps> = ({ rows }) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 space-y-5 shadow-inner">
      <SectionHeading label="System Metadata" icon={History} />
      <div className="divide-y divide-slate-200/70">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
              {row.label}
            </span>
            <span className={`text-sm font-bold text-slate-900 tracking-tight text-right ${row.valueClassName || ''}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemMetadataCard;
