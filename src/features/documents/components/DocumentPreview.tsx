
import React from 'react';
import { FileText, Image as ImageIcon, FileCode, FileQuestion, FileSpreadsheet, FileArchive, FileJson, Presentation, FileText as PdfIcon, Clapperboard } from 'lucide-react';
import { DocumentAttachment } from "@/types";

interface DocumentPreviewProps {
  attachment: DocumentAttachment;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ attachment, size = 'md', className = '' }) => {
  const isImage = attachment.contentType.startsWith('image/');
  const isPdf = attachment.contentType === 'application/pdf';
  const isSpreadsheet = attachment.contentType.includes('spreadsheet') || attachment.contentType.includes('excel') || attachment.fileName.endsWith('.csv');
  const isVideo = attachment.contentType.startsWith('video/');
  const imageSrc = attachment.thumbnailUrl || attachment.dataUrl;

  const getIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 48 : 24;
    
    if (isImage) return <ImageIcon size={iconSize} />;
    if (isPdf) return <PdfIcon size={iconSize} className="text-red-500" />;
    if (isSpreadsheet) return <FileSpreadsheet size={iconSize} className="text-emerald-500" />;
    if (isVideo) return <Clapperboard size={iconSize} className="text-indigo-500" />;
    if (attachment.contentType.includes('json')) return <FileJson size={iconSize} />;
    if (attachment.contentType.includes('zip') || attachment.contentType.includes('rar')) return <FileArchive size={iconSize} />;
    
    return <FileText size={iconSize} />;
  };

  const containerSizes = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-12 h-12 rounded-xl",
    lg: "w-full aspect-[4/3] rounded-2xl"
  };

  if (isImage && imageSrc) {
    return (
      <div className={`${containerSizes[size]} overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 ${className}`}>
        <img 
          src={imageSrc} 
          alt={attachment.fileName} 
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${containerSizes[size]} border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 ${className}`}>
      {getIcon()}
    </div>
  );
};

export default DocumentPreview;
