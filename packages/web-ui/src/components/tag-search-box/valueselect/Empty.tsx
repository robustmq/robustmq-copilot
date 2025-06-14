import React from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { CommandEmpty, CommandList } from "@/components/ui/command";

interface EmptyProps {
  offset: number;
  onCancel: () => void;
  emptyText: string;
}

export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ offset, onCancel, emptyText }, ref) => {
    return (
      <DropdownMenu>
        <CommandList>
          <CommandEmpty onClick={onCancel}>{emptyText || "Empty"}</CommandEmpty>
        </CommandList>
      </DropdownMenu>
    );
  }
);

Empty.displayName = "Empty";
