import { DataTable } from '@/components/table';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { fetchTopicList } from './service';

export default function TopicList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'topicId',
      accessorKey: 'topicId',
      header: 'TopicId',
    },
    {
      accessorKey: 'topicName',
      header: 'TopicName',
    },
    {
      accessorKey: 'clusterName',
      header: 'Node',
    },
  ];

  const { data } = useQuery({
    queryKey: ['QueryTopicData'],
    queryFn: fetchTopicList,
  });

  console.log(data);

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable data={data || []} columns={columns} hideToolBar />
    </div>
  );
}
