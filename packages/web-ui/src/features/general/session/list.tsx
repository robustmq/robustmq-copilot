import { DataTable } from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { getSessionList } from '@/services/mqtt';
import { format } from 'date-fns';

export default function SessionList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'clientId',
      accessorKey: 'client_id',
      header: 'Client ID',
    },
    {
      accessorKey: 'session_expiry',
      header: 'Session Expiry (s)',
      cell: ({ row }) => row.original.session_expiry || '-',
    },
    {
      accessorKey: 'is_contain_last_will',
      header: 'Has Last Will',
      cell: ({ row }) => (row.original.is_contain_last_will ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'last_will_delay_interval',
      header: 'Last Will Delay (s)',
      cell: ({ row }) => row.original.last_will_delay_interval || '-',
    },
    {
      accessorKey: 'create_time',
      header: 'Created At',
      cell: ({ row }) =>
        row.original.create_time ? format(new Date(row.original.create_time * 1000), 'yyyy-MM-dd HH:mm:ss') : '-',
    },
    {
      accessorKey: 'connection_id',
      header: 'Connection ID',
      cell: ({ row }) => row.original.connection_id || '-',
    },
    {
      accessorKey: 'broker_id',
      header: 'Broker ID',
      cell: ({ row }) => row.original.broker_id || '-',
    },
    {
      accessorKey: 'reconnect_time',
      header: 'Reconnected At',
      cell: ({ row }) =>
        row.original.reconnect_time ? format(new Date(row.original.reconnect_time * 1000), 'yyyy-MM-dd HH:mm:ss') : '-',
    },
    {
      accessorKey: 'distinct_time',
      header: 'Disconnect Time',
      cell: ({ row }) =>
        row.original.distinct_time ? format(new Date(row.original.distinct_time * 1000), 'yyyy-MM-dd HH:mm:ss') : '-',
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
