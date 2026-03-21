import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { FilterValue } from '@/components/table/filter';
import { getSessionListHttp } from '@/services/mqtt';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Hash, Timer, MessageSquare, Calendar, LogOut, CheckCircle, XCircle, Eye, Copy, Building2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';

interface SessionListProps {
  leftActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function SessionList({ leftActions, tenant, onSearch }: SessionListProps) {
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

  const columns: ColumnDef<any>[] = [
    {
      id: 'client_id',
      accessorKey: 'client_id',
      header: 'Client ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 max-w-xs">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity flex-1 min-w-0"
            onClick={() =>
              navigate({
                to: '/general/session/$sessionId',
                params: { sessionId: row.original.client_id },
                state: { sessionData: row.original },
              })
            }
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 flex-shrink-0">
              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-medium text-purple-600 dark:text-purple-400 hover:underline truncate">
              {row.original.client_id}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900"
            onClick={e => handleCopyClientId(row.original.client_id, e)}
          >
            <Copy className="h-3 w-3 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" />
          </Button>
        </div>
      ),
      size: 280,
    },
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.tenant || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'connection_id',
      header: 'Connection ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.connection_id || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const connectionId = row.original.connection_id;
        const isOnline = connectionId && connectionId > 0;

        return (
          <Badge
            variant={isOnline ? 'default' : 'secondary'}
            className={
              isOnline
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm'
                : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-sm'
            }
          >
            {isOnline ? (
              <>
                <CheckCircle className="mr-1 h-3 w-3" />
                Online
              </>
            ) : (
              <>
                <XCircle className="mr-1 h-3 w-3" />
                Offline
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'session_expiry',
      header: 'Session Expiry',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
        >
          <Timer className="mr-1 h-3 w-3" />
          {row.original.session_expiry ? `${row.original.session_expiry}s` : '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'last_will',
      header: 'Has Last Will',
      cell: ({ row }) => {
        const hasLastWill = row.original.last_will && row.original.last_will !== null;
        return (
          <Badge
            variant={hasLastWill ? 'default' : 'secondary'}
            className={
              hasLastWill
                ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }
          >
            <MessageSquare className="mr-1 h-3 w-3" />
            {hasLastWill ? 'Yes' : 'No'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'create_time',
      header: 'Created At',
      cell: ({ row }) => {
        if (!row.original.create_time) return '-';
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{format(new Date(row.original.create_time * 1000), 'yyyy-MM-dd HH:mm:ss')}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'distinct_time',
      header: 'Disconnect Time',
      cell: ({ row }) => {
        if (!row.original.distinct_time) return '-';
        return (
          <div className="flex items-center space-x-2">
            <LogOut className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {format(new Date(row.original.distinct_time * 1000), 'yyyy-MM-dd HH:mm:ss')}
            </span>
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
            navigate({
              to: '/general/session/$sessionId',
              params: { sessionId: row.original.client_id },
              state: { sessionData: row.original },
            });
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
    const ret = await getSessionListHttp({
      pagination: { offset: pageIndex * pageSize, limit: pageSize },
      sort_field: 'create_time',
      sort_by: 'desc',
      ...(tenant ? { tenant } : {}),
      ...(clientIdVal ? { client_id: clientIdVal } : {}),
    } as any);
    return {
      data: ret.sessionsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QuerySessionListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        onSearch={onSearch}
        searchPlaceholder="Search by client ID..."
      />
    </div>
  );
}
