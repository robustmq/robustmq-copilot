import * as React from 'react';
import { useMemo } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import { useQuery } from '@tanstack/react-query';
import { AttributeValue, TagValue } from '@/components/tag-search-box';
import { convertTagToSearchValue, FilterValue } from './filter';
import { Separator } from '@/components/ui/separator';

type FetchDataFn<TData> = (
  pageIndex: number,
  pageSize: number,
  searchValue: FilterValue[],
) => Promise<{
  data: TData[];
  totalCount: number;
}>;

export type ColumnSetting<TData, TValue> = ColumnDef<TData, TValue> & {
  // search by attribute
  attr?: Partial<AttributeValue> | boolean;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnSetting<TData, TValue>[];
  hideToolBar?: boolean;
  fetchDataFn: FetchDataFn<TData>;
  queryKey: string;
  defaultPageSize?: number;
  defaultSorting?: SortingState;
  extraActions?: React.ReactNode;
  leftActions?: React.ReactNode;
  headerClassName?: string;
}

export function DataTable<TData, TValue>({
  columns,
  hideToolBar = false,
  fetchDataFn,
  queryKey,
  defaultPageSize = 20,
  defaultSorting = [],
  extraActions,
  leftActions,
  headerClassName,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [tagFilters, setTagFilters] = React.useState<TagValue[]>([]);

  const query = useQuery({
    queryKey: [queryKey, pagination.pageIndex, pagination.pageSize, tagFilters],
    queryFn: () => {
      const searchValue = convertTagToSearchValue(tagFilters);
      return fetchDataFn(pagination.pageIndex, pagination.pageSize, searchValue);
    },
    refetchOnWindowFocus: false,
  });

  const handleRefresh = React.useCallback(() => {
    query.refetch();
  }, [query.refetch]);

  const table = useReactTable({
    data: query?.data?.data || [],
    pageCount: Math.ceil((query?.data?.totalCount || 0) / pagination.pageSize),
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const attrFilter = useMemo(() => {
    return columns
      .filter(c => c.attr)
      .map(c => {
        return {
          // @ts-ignore
          key: c?.accessorKey as string,
          type: 'input',
          // @ts-ignore
          name: c?.accessorKey as string,
          ...(typeof c.attr === 'object' ? c.attr : {}),
        };
      }) as AttributeValue[];
  }, [columns]);

  return (
    <div className="space-y-2">
      {!hideToolBar && (
        <>
          <DataTableToolbar
            table={table}
            onRefresh={handleRefresh}
            tagFilters={tagFilters}
            onTagFilterChange={setTagFilters}
            attrFilters={attrFilter}
            extraActions={extraActions}
            leftActions={leftActions}
            isRefreshing={query.isFetching}
          />
          <Separator className="my-2" />
        </>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader className={headerClassName}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className={headerClassName ? 'border-0' : ''}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={headerClassName ? 'text-white font-semibold' : ''}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {query.isFetching ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
