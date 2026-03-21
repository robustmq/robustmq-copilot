import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getBanLogListHttp, BanLogRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { FileX, Shield, User, Clock, Building2, RadioTower } from 'lucide-react';

const BAN_TYPE_MAP: Record<string, string> = {
  ClientId: 'Client ID',
  User: 'User',
  Ip: 'IP',
  ClientIdMatch: 'Client ID Match',
  UserMatch: 'User Match',
  IPCIDR: 'IP CIDR',
};

const getBanTypeIcon = (type: string) => {
  switch (type) {
    case 'ClientId':
    case 'ClientIdMatch':
      return FileX;
    case 'User':
    case 'UserMatch':
      return User;
    case 'Ip':
    case 'IPCIDR':
      return Shield;
    default:
      return FileX;
  }
};

interface BanLogListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function BanLogList({ leftActions, extraActions, tenant, onSearch }: BanLogListProps) {
  const columns: ColumnDef<BanLogRaw>[] = [
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
      accessorKey: 'ban_type',
      header: 'Ban Type',
      cell: ({ row }) => {
        const type = row.original.ban_type;
        const Icon = getBanTypeIcon(type);
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800">
            <Icon className="mr-1 h-3 w-3" />
            {BAN_TYPE_MAP[type] || type}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'resource_name',
      header: 'Resource Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <FileX className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium font-mono text-sm max-w-32 truncate" title={row.original.resource_name}>
            {row.original.resource_name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'ban_source',
      header: 'Source',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <RadioTower className="h-4 w-4 text-gray-500" />
          <Badge variant="outline" className={
            row.original.ban_source === 'auto'
              ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800'
              : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
          }>
            {row.original.ban_source || '-'}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.end_time || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'create_time',
      header: 'Create Time',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.create_time || '-'}</span>
        </div>
      ),
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    try {
      const ret = await getBanLogListHttp({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(tenant ? { tenant } : {}),
      });
      return {
        data: ret.banLogsList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch ban log data:', error);
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryBanLogListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
      />
    </div>
  );
}
