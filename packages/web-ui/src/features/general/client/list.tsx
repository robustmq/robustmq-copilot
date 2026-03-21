import { ColumnSetting, DataTable } from '@/components/table';
import { getClientListHttp } from '@/services/mqtt';
import { FilterValue } from '@/components/table/filter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hash, Wifi, Clock, User, Eye, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';

interface ClientListProps {
  leftActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function SessionList({ leftActions, tenant, onSearch }: ClientListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCopyClientId = (clientId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(clientId);
    toast({
      title: 'Copied!',
      description: 'Client ID copied to clipboard',
      duration: 2000,
    });
  };

  const columns: ColumnSetting<any, any>[] = [
    {
      id: 'client_id',
      accessorKey: 'client_id',
      header: 'Client ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 max-w-xs">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity flex-1 min-w-0"
            onClick={() => navigate({ to: '/general/client/$clientId', params: { clientId: row.original.client_id } })}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-purple-600 dark:text-purple-400 hover:underline truncate">
              {row.original.client_id}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0 hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={e => handleCopyClientId(row.original.client_id, e)}
          >
            <Copy className="h-3 w-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" />
          </Button>
        </div>
      ),
      size: 280,
    },
    {
      id: 'tenant',
      accessorKey: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.mqtt_connection?.tenant || '-'}
        </span>
      ),
    },
    {
      id: 'source_ip',
      header: 'Source IP',
      cell: ({ row }) => (
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {row.original.mqtt_connection?.source_ip_addr || '-'}
        </span>
      ),
    },
    {
      id: 'connection_id',
      accessorKey: 'connection_id',
      header: 'Connection ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium font-mono">{row.original.connection_id}</span>
        </div>
      ),
    },
    {
      accessorKey: 'connection_type',
      header: 'Connection Type',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-300 dark:from-purple-950 dark:to-purple-900 dark:text-purple-300 dark:border-purple-700"
        >
          <Wifi className="mr-1 h-3 w-3" />
          {row.original.network_connection?.connection_type || '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'protocol',
      header: 'Protocol',
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
          {row.original.network_connection?.protocol || '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'create_time',
      header: 'Created At',
      cell: ({ row }) => {
        const createTime = row.original.mqtt_connection?.create_time;
        if (!createTime) return '-';

        // 如果是时间戳（数字），转换为日期格式
        const timestamp = typeof createTime === 'string' ? parseInt(createTime) : createTime;
        const formattedTime = format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');

        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{formattedTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'heartbeat_time',
      header: 'Heartbeat Time',
      cell: ({ row }) => {
        const heartbeatTime = row.original.heartbeat?.heartbeat;
        if (!heartbeatTime) return '-';

        // 如果是时间戳（数字），转换为日期格式
        const timestamp = typeof heartbeatTime === 'string' ? parseInt(heartbeatTime) : heartbeatTime;
        const formattedTime = format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');

        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-sm">{formattedTime}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'keep_alive',
      header: 'Keep Alive',
      cell: ({ row }) => {
        const keepLive = row.original.heartbeat?.keep_live;
        if (keepLive === null || keepLive === undefined) return '-';

        return (
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
            >
              <Clock className="mr-1 h-3 w-3" />
              {keepLive}s
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
          onClick={() => {
            navigate({ to: '/general/client/$clientId', params: { clientId: row.original.client_id } });
          }}
        >
          <Eye className="mr-0.5 h-2.5 w-2.5" />
          Details
        </Button>
      ),
      size: 100,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const clientIdVal = searchValue.find(f => f.field === 'client_id' || f.field === '')?.valueList?.[0];

    const ret = await getClientListHttp({
      pagination: { offset: pageIndex * pageSize, limit: pageSize },
      sort_field: 'connection_id',
      sort_by: 'desc',
      ...(tenant ? { tenant } : {}),
      ...(clientIdVal ? { client_id: clientIdVal } : {}),
    } as any);
    return {
      data: ret.clientsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryClientListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        onSearch={onSearch}
        searchPlaceholder="Search by client ID..."
      />
    </div>
  );
}
