import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { priorities, statuses } from './data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onRefresh?: () => void;
}

export function DataTableToolbar<TData>({ table, onRefresh }: DataTableToolbarProps<TData>) {
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
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={event => table.getColumn('title')?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter column={table.getColumn('status')} title="Status" options={statuses} />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter column={table.getColumn('priority')} title="Priority" options={priorities} />
          )}
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
