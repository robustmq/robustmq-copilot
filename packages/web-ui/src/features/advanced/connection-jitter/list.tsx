import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getConnectionJitterListHttp, ConnectionJitterRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { User, Clock, TrendingUp, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { FilterValue } from '@/components/table/filter';

interface ConnectionJitterListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function ConnectionJitterList({ leftActions, extraActions, tenant, onSearch }: ConnectionJitterListProps) {
  const columns: ColumnDef<ConnectionJitterRaw>[] = [
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
          <span className="font-medium font-mono text-sm max-w-32 truncate" title={row.original.client_id}>
            {row.original.client_id}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'before_last_window_connections',
      header: 'Connection Count',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.before_last_window_connections > 10
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
              : row.original.before_last_window_connections > 5
                ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800'
                : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800'
          }
        >
          <TrendingUp className="mr-1 h-3 w-3" />
          {row.original.before_last_window_connections} connections
        </Badge>
      ),
    },
    {
      accessorKey: 'first_request_time',
      header: 'First Request Time',
      cell: ({ row }) => {
        const timestamp = row.original.first_request_time;
        let timeDisplay = '-';
        if (timestamp) {
          try {
            const date = new Date(timestamp * 1000);
            if (!isNaN(date.getTime())) timeDisplay = format(date, 'yyyy-MM-dd HH:mm:ss');
          } catch {}
        }
        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="font-mono text-sm max-w-32 truncate" title={timeDisplay}>{timeDisplay}</span>
          </div>
        );
      },
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const clientIdVal = searchValue.find(f => f.field === 'client_id' || f.field === '')?.valueList?.[0];
    try {
      const ret = await getConnectionJitterListHttp({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(tenant ? { tenant } : {}),
        ...(clientIdVal ? { client_id: clientIdVal } : {}),
      });
      return {
        data: ret.connectionJittersList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch connection jitter data:', error);
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryConnectionJitterListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by client ID..."
      />
    </div>
  );
}
