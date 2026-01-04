import React from "react";
import { SortHeader, type SortDirection } from "./SortHeader";

export type DataTableSortKey<T> = Extract<keyof T, string>;
export type DataTableSort<T> = { key: DataTableSortKey<T>; direction: SortDirection };

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  headerClassName?: string;
  className?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortKey?: DataTableSortKey<T>;
};

export type DataTableProps<T> = {
  rows: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowKey: (row: T, index: number) => React.Key;
  sort?: DataTableSort<T>;
  onSort?: (key: DataTableSortKey<T>) => void;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
};

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  sort,
  onSort,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            {columns.map((col) => {
              const align =
                col.align === "right"
                  ? "text-right"
                  : col.align === "center"
                    ? "text-center"
                    : "text-left";
              const isSortable = Boolean(col.sortable && col.sortKey && onSort);
              const isActive = Boolean(sort && col.sortKey && sort.key === col.sortKey);
              const direction = sort?.direction ?? "asc";

              return (
                <th key={col.id} className={`px-8 py-4 ${align} ${col.headerClassName ?? ""}`}>
                  {isSortable ? (
                    <SortHeader
                      label={col.header}
                      active={isActive}
                      direction={direction}
                      onClick={() => onSort?.(col.sortKey!)}
                    />
                  ) : (
                    <SortHeader label={col.header} className={align} />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => {
            const key = getRowKey(row, index);
            const clickable = Boolean(onRowClick);
            return (
              <tr
                key={key}
                onClick={clickable ? () => onRowClick?.(row) : undefined}
                className={[
                  "transition-colors group/row",
                  clickable ? "cursor-pointer hover:bg-slate-50/50" : "hover:bg-slate-50/50",
                  rowClassName?.(row) ?? "",
                ].join(" ")}
              >
                {columns.map((col) => {
                  const align =
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                        ? "text-center"
                        : "text-left";
                  return (
                    <td key={col.id} className={`px-8 py-6 ${align} ${col.className ?? ""}`}>
                      {col.cell(row)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

