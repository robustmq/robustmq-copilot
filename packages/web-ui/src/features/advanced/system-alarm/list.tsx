import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getSystemAlarmListHttp, SystemAlarmRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MessageSquare, Clock, Activity } from 'lucide-react';
import { ViewSystemAlarmButton } from './components/view-system-alarm-button';

interface SystemAlarmListProps {
  extraActions?: React.ReactNode;
}

export default function SystemAlarmList({ extraActions }: SystemAlarmListProps) {
  const columns: ColumnDef<SystemAlarmRaw>[] = [
    {
      accessorKey: 'name',
      header: 'Alarm Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-sm max-w-32 truncate" title={row.original.name}>
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-muted-foreground max-w-48 truncate" title={row.original.message}>
            {row.original.message || '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'activated',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            row.original.activated
              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
              : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
          }
        >
          <Activity className="mr-1 h-3 w-3" />
          {row.original.activated ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'activate_at',
      header: 'Activated At',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm max-w-32 truncate" title={row.original.activate_at}>
            {row.original.activate_at || '-'}
          </span>
        </div>
      ),
    },
    {
      id: 'view',
      header: 'Details',
      cell: ({ row }) => <ViewSystemAlarmButton systemAlarm={row.original} />,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    try {
      const ret = await getSystemAlarmListHttp({
        pagination: {
          offset: pageIndex * pageSize,
          limit: pageSize,
        },
      });
      return {
        data: ret.systemAlarmsList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch system alarm data:', error);
      return {
        data: [],
        totalCount: 0,
      };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey="QuerySystemAlarmListData"
        headerClassName="bg-purple-600 text-white"
        extraActions={extraActions}
        hideToolBar
      />
    </div>
  );
}
