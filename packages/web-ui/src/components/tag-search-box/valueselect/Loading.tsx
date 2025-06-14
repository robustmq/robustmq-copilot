import React from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { CommandList, CommandItem } from "@/components/ui/command";

interface LoadingProps {
  offset: number;
}

export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ offset }, ref) => {
    return (
      <DropdownMenu>
        <CommandList>
          <CommandItem>Loading...</CommandItem>
        </CommandList>
      </DropdownMenu>
    );
  }
);

Loading.displayName = "Loading";
