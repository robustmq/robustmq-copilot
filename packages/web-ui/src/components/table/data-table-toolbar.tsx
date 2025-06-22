import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from './data-table-view-options';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AttributeValue, TagSearchBox, TagValue } from '@/components/tag-search-box';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRefresh?: () => void;
  tagFilters: TagValue[];
  onTagFilterChange?: (tagFilters: TagValue[]) => void;
  attrFilters: AttributeValue[];
}

export function DataTableToolbar<TData>({
  table,
  onRefresh,
  tagFilters,
  onTagFilterChange,
  attrFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // 如果没有提供刷新函数，默认重置表格并重新获取数据
      table.resetRowSelection();
      // 如果表格有 refetch 方法（通常从 React Query 获取）
      if ((table.options.meta as any)?.refetch) {
        (table.options.meta as any).refetch();
      }
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <div className="w-[720px]">
          <TagSearchBox
            value={tagFilters}
            onChange={onTagFilterChange}
            attributes={attrFilters}
            onSearchButtonClick={() => {
              handleRefresh();
            }}
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
        <DataTableViewOptions table={table} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3" onClick={handleRefresh}>
                <ReloadIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
