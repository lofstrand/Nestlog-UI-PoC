import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  hideIfSinglePage?: boolean;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  className = "",
  hideIfSinglePage = true,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const range = useMemo(() => {
    const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalItems);
    return { from, to };
  }, [page, pageSize, totalItems]);

  if (hideIfSinglePage && totalPages <= 1) return null;

  return (
    <div
      className={`px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between ${className}`}
    >
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Showing {range.from}-{range.to} of {totalItems}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="white"
          size="sm"
          icon={ChevronLeft}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        />
        <Button
          variant="white"
          size="sm"
          icon={ChevronRight}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        />
      </div>
    </div>
  );
};

