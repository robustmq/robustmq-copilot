import { DataTable } from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { getSessionList } from '@/services/mqtt';
import { format } from 'date-fns';

export default function SessionList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'clientId',
      accessorKey: 'clientId',
      header: 'Client ID',
    },
    {
      accessorKey: 'connectionId',
      header: 'Connection ID',
      cell: ({ row }) => row.original.connectionId || '-',
    },
    {
      accessorKey: 'brokerId',
      header: 'Broker ID',
      cell: ({ row }) => row.original.brokerId || '-',
    },
    {
      accessorKey: 'sessionExpiry',
      header: 'Session Expiry (s)',
      cell: ({ row }) => row.original.sessionExpiry || '-',
    },
    {
      accessorKey: 'isContainLastWill',
      header: 'Has Last Will',
      cell: ({ row }) => (row.original.isContainLastWill ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'lastWillDelayInterval',
      header: 'Last Will Delay (s)',
      cell: ({ row }) => row.original.lastWillDelayInterval || '-',
    },
    {
      accessorKey: 'createTime',
      header: 'Created At',
      cell: ({ row }) => (row.original.createTime ? format(row.original.createTime, 'yyyy-MM-dd HH:mm:ss') : '-'),
    },
    {
      accessorKey: 'reconnectTime',
      header: 'Reconnected At',
      cell: ({ row }) => (row.original.reconnectTime ? format(row.original.reconnectTime, 'yyyy-MM-dd HH:mm:ss') : '-'),
    },
    {
      accessorKey: 'distinctTime',
      header: 'Disconnect Time',
      cell: ({ row }) => (row.original.distinctTime ? format(row.original.distinctTime, 'yyyy-MM-dd HH:mm:ss') : '-'),
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
