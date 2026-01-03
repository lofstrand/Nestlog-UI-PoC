import React, { useState } from "react";
import { Tag as TagIcon, Plus, X } from "lucide-react";
import { Tag } from "@/types";

interface TagsSectionProps {
  entityTags: string[];
  availableTags: Tag[];
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  entityTags,
  availableTags,
  onAddTag,
  onRemoveTag,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddTag(inputValue.trim());
      setInputValue("");
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-50 text-slate-500 flex items-center justify-center rounded-xl border border-slate-100">
            <TagIcon size={14} strokeWidth={2.5} />
          </div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Tags
          </h3>
        </div>

        {isAdding ? (
          <button
            onClick={() => {
              setIsAdding(false);
              setInputValue("");
            }}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight bg-white border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <X size={12} className="mr-1.5" /> Cancel
          </button>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight bg-white border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all shadow-sm"
          >
            <Plus size={12} className="mr-1.5" /> Assign
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {entityTags.map((tagName) => {
          const tagDef = availableTags.find((t) => t.name === tagName);
          const color = tagDef?.colorHex || "#1e293b";

          return (
            <span
              key={tagName}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shadow-sm border"
              style={{
                backgroundColor: `${color}08`,
                color: color,
                borderColor: `${color}20`,
              }}
            >
              {tagName}
              <button
                onClick={() => onRemoveTag(tagName)}
                className="ml-2 opacity-30 hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </span>
          );
        })}

        {isAdding ? (
          <div className="flex items-center space-x-1 animate-in zoom-in-95 duration-200">
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              onBlur={() => !inputValue && setIsAdding(false)}
              placeholder="Tag name..."
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-400 w-28 bg-white shadow-inner"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TagsSection;
