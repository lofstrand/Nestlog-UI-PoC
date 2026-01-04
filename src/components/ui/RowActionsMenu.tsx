import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "./Button";

export type RowActionsMenuProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  confirmDelete?: boolean;
  deleteConfirmText?: string;
};

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
  onView,
  onEdit,
  onDelete,
  confirmDelete = true,
  deleteConfirmText = "Delete this item?",
}) => {
  const handleDelete = () => {
    if (!onDelete) return;
    if (!confirmDelete || window.confirm(deleteConfirmText)) onDelete();
  };

  return (
    <div className="inline-flex items-center justify-end gap-1">
      {onView && (
        <Button variant="ghost" size="sm" icon={Eye} onClick={onView}>
          View
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" icon={Pencil} onClick={onEdit}>
          Edit
        </Button>
      )}
      {onDelete && (
        <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
          Delete
        </Button>
      )}
    </div>
  );
};

