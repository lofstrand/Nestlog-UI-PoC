import React, { useState } from "react";
import { Camera, Play, X, Trash2, Plus, ImageOff } from "lucide-react";
import { GalleryItem } from "@/types";
import { SectionHeading } from "@/components/ui/UIPrimitives";

interface VisualArchiveProps {
  items: GalleryItem[];
  onAddItem: () => void;
  onDeleteItem?: (id: string) => void;
}

const ImageWithFallback: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-50 text-slate-300 gap-2 ${className}`}
      >
        <ImageOff size={24} className="opacity-20" />
        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
          Asset Missing
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

const VisualArchive: React.FC<VisualArchiveProps> = ({
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const [viewerItem, setViewerItem] = useState<GalleryItem | null>(null);

  const openViewer = (item: GalleryItem) => setViewerItem(item);
  const closeViewer = () => setViewerItem(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeading label="Gallery" icon={Camera} />
        <button
          onClick={onAddItem}
          className="p-1.5 text-slate-400 hover:text-slate-900 transition-all active:scale-90"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            onClick={() => openViewer(item)}
          >
            <ImageWithFallback
              src={item.thumbnailUrl || item.url}
              alt={item.title || "Gallery item"}
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
            />

            {item.type === "video" && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <Play size={18} fill="currentColor" className="ml-1" />
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">
                {item.title || "Untitled"}
              </p>
            </div>

            {onDeleteItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={onAddItem}
          className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all group"
        >
          <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">
            Append Media
          </span>
        </button>
      </div>

      {viewerItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 animate-in fade-in duration-300 backdrop-blur-xl">
          <button
            onClick={closeViewer}
            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all z-10"
          >
            <X size={24} />
          </button>

          <div className="w-full max-w-5xl px-8 flex flex-col items-center">
            {viewerItem.type === "video" ? (
              <video
                src={viewerItem.url}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-3xl shadow-2xl bg-black"
              />
            ) : (
              <ImageWithFallback
                src={viewerItem.url}
                alt={viewerItem.title || "Full view"}
                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/5"
              />
            )}

            <div className="mt-8 text-center space-y-2 max-w-2xl">
              <h4 className="text-white text-2xl font-black tracking-tight">
                {viewerItem.title || "Archive Entry"}
              </h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                {viewerItem.description ||
                  "Captured documentation for management logs."}
              </p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest pt-4">
                Captured:{" "}
                {new Date(viewerItem.createdAtUtc).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualArchive;
