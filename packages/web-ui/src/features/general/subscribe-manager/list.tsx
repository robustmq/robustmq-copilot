import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getSubscribeList } from '@/services/mqtt';
import { format } from 'date-fns';

export default function SubscribeList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'Client ID',
      accessorKey: 'clientId',
      header: 'Client ID',
    },
    {
      accessorKey: 'path',
      header: 'Path',
      cell: ({ row }) => row.original.path || '-',
    },
    {
      accessorKey: 'brokerId',
      header: 'Broker ID',
      cell: ({ row }) => row.original.brokerId || '-',
    },
    {
      accessorKey: 'protocol',
      header: 'Protocol',
      cell: ({ row }) => row.original.protocol || '-',
    },
    {
      accessorKey: 'qos',
      header: 'QoS',
      cell: ({ row }) => row.original.qos || '-',
    },
    {
      accessorKey: 'noLocal',
      header: 'No Local',
      cell: ({ row }) => (row.original.noLocal ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'preserveRetain',
      header: 'Preserve Retain',
      cell: ({ row }) => row.original.preserveRetain || '-',
    },
    {
      accessorKey: 'retainHandling',
      header: 'Retain Handling',
      cell: ({ row }) => row.original.retainHandling || '-',
    },
    {
      accessorKey: 'pkId',
      header: 'PK ID',
      cell: ({ row }) => row.original.pkId || '-',
    },
    {
      accessorKey: 'properties',
      header: 'Properties',
      cell: ({ row }) => row.original.properties || '-',
    },
    {
      accessorKey: 'createTime',
      header: 'Created At',
      cell: ({ row }) => (row.original.createTime ? format(row.original.createTime, 'yyyy-MM-dd HH:mm:ss') : '-'),
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    const ret = await getSubscribeList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
    });
    return {
      data: ret.subscriptionsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable columns={columns} fetchDataFn={fetchDataFn} queryKey="QuerySessionListData" />
    </div>
  );
}
