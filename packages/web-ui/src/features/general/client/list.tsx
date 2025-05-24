import { format } from 'date-fns';
import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getClientList } from '@/services/mqtt';
import StatusBadge from '@/components/status-badge';

export default function SessionList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'clientId',
      accessorKey: 'clientId',
      header: 'Client ID',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'isOnline',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.isOnline ? 'online' : 'offline'} />,
    },
    {
      accessorKey: 'sourceIp',
      header: 'Source IP',
    },
    {
      accessorKey: 'connectedAt',
      header: 'Connected At',
      cell: ({ row }) => {
        if (!row.original.connectedAt) return '-';
        const date = new Date(row.original.connectedAt * 1000);
        return format(date, 'yyyy-MM-dd HH:mm:ss');
      },
    },
    {
      accessorKey: 'keepAlive',
      header: 'Keep Alive (s)',
      cell: ({ row }) => row.original.keepAlive || '-',
    },
    {
      accessorKey: 'cleanSession',
      header: 'Clean Session',
      cell: ({ row }) => (row.original.cleanSession ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'sessionExpiryInterval',
      header: 'Session Expiry (s)',
      cell: ({ row }) => row.original.sessionExpiryInterval || '-',
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    const ret = await getClientList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
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
