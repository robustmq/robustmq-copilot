import { format } from 'date-fns';
import { ColumnSetting, DataTable } from '@/components/table';
import { getClientList } from '@/services/mqtt';
import StatusBadge from '@/components/status-badge';
import { FilterValue } from '@/components/table/filter';

export default function SessionList() {
  const columns: ColumnSetting<any, any>[] = [
    {
      id: 'clientId',
      accessorKey: 'clientId',
      header: 'Client ID',
      attr: true,
    },
    {
      accessorKey: 'username',
      header: 'Username',
      attr: true,
    },
    {
      accessorKey: 'isOnline',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.isOnline ? 'online' : 'offline'} />,
      attr: true,
    },
    {
      accessorKey: 'sourceIp',
      header: 'Source IP',
      attr: true,
    },
    {
      accessorKey: 'connectedAt',
      header: 'Connected At',
      cell: ({ row }) => {
        if (!row.original.connectedAt) return '-';
        const date = new Date(row.original.connectedAt * 1000);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      },
      attr: true,
    },
    {
      accessorKey: 'keepAlive',
      header: 'Keep Alive (s)',
      cell: ({ row }) => row.original.keepAlive || '-',
      attr: true,
    },
    {
      accessorKey: 'cleanSession',
      header: 'Clean Session',
      cell: ({ row }) => (row.original.cleanSession ? 'Yes' : 'No'),
      attr: true,
    },
    {
      accessorKey: 'sessionExpiryInterval',
      header: 'Session Expiry (s)',
      cell: ({ row }) => row.original.sessionExpiryInterval || '-',
      attr: true,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const ret = await getClientList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
      filers: searchValue,
    });
    return {
      data: ret.clientsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable columns={columns} fetchDataFn={fetchDataFn} queryKey="QueryClientListData" />
    </div>
  );
}
