import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getTopicList } from '@/services/mqtt';

export default function TopicList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'Topic ID',
      accessorKey: 'topicId',
      header: 'Topic ID',
    },
    {
      accessorKey: 'clusterId',
      header: 'Cluster ID',
      cell: ({ row }) => row.original.clusterId || '-',
    },
    {
      accessorKey: 'topicName',
      header: 'Topic Name',
      cell: ({ row }) => row.original.topicName || '-',
    },
    {
      accessorKey: 'retainMessage',
      header: 'Has Retain Message',
      cell: ({ row }) => (row.original.retainMessage ? 'Yes' : 'No'),
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    const ret = await getTopicList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
    });
    return {
      data: ret.topicsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable columns={columns} fetchDataFn={fetchDataFn} queryKey="QuerySessionListData" />
    </div>
  );
}
