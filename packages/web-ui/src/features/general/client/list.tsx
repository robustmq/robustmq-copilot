import { format } from 'date-fns';
import { DataTable } from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { getSessionList } from '@/services/mqtt';

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
      cell: ({ row }) => (row.original.isOnline ? 'Online' : 'Offline'),
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

  const query = useQuery({
    queryKey: ['QuerySessionListData'],
    queryFn: async () => {
      const ret = await getSessionList();
      return ret.sessionsList;
    },
  });

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable query={query} columns={columns} hideToolBar />
    </div>
  );
}
