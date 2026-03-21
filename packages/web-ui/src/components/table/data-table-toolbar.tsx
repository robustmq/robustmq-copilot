import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from './data-table-view-options';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AttributeValue, TagSearchBox, TagValue } from '@/components/tag-search-box';
import { useState, useEffect } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRefresh?: () => void;
  onSearchClick?: () => void;
  tagFilters: TagValue[];
  onTagFilterChange?: (tagFilters: TagValue[]) => void;
  attrFilters: AttributeValue[];
  extraActions?: React.ReactNode;
  leftActions?: React.ReactNode;
  isRefreshing?: boolean;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  onRefresh,
  onSearchClick,
  tagFilters,
  onTagFilterChange,
  attrFilters,
  extraActions,
  leftActions,
  isRefreshing = false,
  searchPlaceholder,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (isRefreshing) setSpinning(true);
  }, [isRefreshing]);

  useEffect(() => {
    if (spinning && !isRefreshing) {
      const t = setTimeout(() => setSpinning(false), 400);
      return () => clearTimeout(t);
    }
  }, [spinning, isRefreshing]);

  const handleRefreshClick = () => {
    setSpinning(true);
    onRefresh?.();
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {leftActions && <div className="flex items-center">{leftActions}</div>}
        <div className="flex-1 max-w-[500px]">
          <TagSearchBox
            value={tagFilters}
            onChange={onTagFilterChange}
            attributes={attrFilters}
            tips={searchPlaceholder}
            onSearchButtonClick={onSearchClick ?? onRefresh}
          />
        </div>
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {extraActions}
        <DataTableViewOptions table={table} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 lg:px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 dark:border-blue-700"
                onClick={handleRefreshClick}
                disabled={spinning}
              >
                <ReloadIcon className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{spinning ? 'Refreshing...' : 'Refresh'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
