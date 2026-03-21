import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getSubscribeListHttp } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, Route, Wifi, Shield, Clock, Eye, Copy, Share2, Building2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '@/hooks/use-toast';
import { FilterValue } from '@/components/table/filter';

interface SubscribeListProps {
  leftActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function SubscribeList({ leftActions, tenant, onSearch }: SubscribeListProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCopyText = (text: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.tenant || '-'}</span>
        </div>
      ),
      size: 140,
    },
    {
      id: 'client_id',
      accessorKey: 'client_id',
      header: 'Client ID',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 max-w-xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 flex-1 min-w-0 cursor-help">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 flex-shrink-0">
                    <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium truncate">{row.original.client_id}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{row.original.client_id}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0 hover:bg-purple-100 dark:hover:bg-purple-900"
            onClick={e => handleCopyText(row.original.client_id, 'Client ID', e)}
          >
            <Copy className="h-3 w-3 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400" />
          </Button>
        </div>
      ),
      size: 280,
    },
    {
      accessorKey: 'path',
      header: 'Path',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 max-w-xs">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 flex-1 min-w-0 cursor-help">
                  <Route className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="font-mono text-sm truncate">{row.original.path || '-'}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{row.original.path || '-'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={e => handleCopyText(row.original.path, 'Path', e)}
          >
            <Copy className="h-3 w-3 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" />
          </Button>
        </div>
      ),
      size: 280,
    },
    {
      accessorKey: 'protocol',
      header: 'Protocol',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
        >
          <Wifi className="mr-1 h-3 w-3" />
          {row.original.protocol || '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'qos',
      header: 'QoS',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
        >
          <Shield className="mr-1 h-3 w-3" />
          {row.original.qos || '-'}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_share_sub',
      header: 'Sub Type',
      cell: ({ row }) =>
        row.original.is_share_sub ? (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800 hover:bg-orange-100">
            <Share2 className="mr-1 h-3 w-3" />
            Shared
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600">
            <User className="mr-1 h-3 w-3" />
            Exclusive
          </Badge>
        ),
      size: 120,
    },
    {
      accessorKey: 'create_time',
      header: 'Created At',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{row.original.create_time || '-'}</span>
        </div>
      ),
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
              to: '/general/subscribe/$subscribeId',
              params: { subscribeId: row.original.client_id || 'unknown' },
              state: { subscribeData: row.original },
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
    const ret = await getSubscribeListHttp({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
      ...(tenant ? { tenant } : {}),
      ...(clientIdVal ? { client_id: clientIdVal } : {}),
    });
    return {
      data: ret.subscriptionsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QuerySubscribeListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        onSearch={onSearch}
        searchPlaceholder="Search by client ID..."
      />
    </div>
  );
}
