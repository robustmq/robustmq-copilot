import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getSlowSubscribeListHttp, SlowSubscribeRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { User, Route, Clock, Server, FileText, Timer, Building2 } from 'lucide-react';
import { FilterValue } from '@/components/table/filter';

interface SlowSubscriptionListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function SlowSubscriptionList({ leftActions, extraActions, tenant, onSearch }: SlowSubscriptionListProps) {
  const columns: ColumnDef<SlowSubscribeRaw>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-purple-400 shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.tenant || '-'}</span>
        </div>
      ),
      size: 120,
      maxSize: 140,
    },
    {
      accessorKey: 'client_id',
      header: 'Client ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium font-mono text-sm">{row.original.client_id}</span>
        </div>
      ),
    },
    {
      accessorKey: 'topic_name',
      header: 'Topic Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Route className="h-4 w-4 text-gray-500" />
          <span className="font-medium font-mono text-sm">{row.original.topic_name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'subscribe_name',
      header: 'Subscribe Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">{row.original.subscribe_name || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'time_span',
      header: 'Time Span (ms)',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.time_span > 3000
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
              : row.original.time_span > 1000
                ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800'
                : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800'
          }
        >
          <Timer className="mr-1 h-3 w-3" />
          {row.original.time_span.toLocaleString()} ms
        </Badge>
      ),
    },
    {
      accessorKey: 'node_info',
      header: 'Node Info',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Server className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.node_info || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'create_time',
      header: 'Created At',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.create_time || '-'}</span>
        </div>
      ),
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const clientIdVal = searchValue.find(f => f.field === 'client_id' || f.field === '')?.valueList?.[0];
    try {
      const ret = await getSlowSubscribeListHttp({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(tenant ? { tenant } : {}),
        ...(clientIdVal ? { client_id: clientIdVal } : {}),
      });
      return {
        data: ret.slowSubscribesList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch slow subscribe data:', error);
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QuerySlowSubscriptionListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by client ID..."
      />
    </div>
  );
}
