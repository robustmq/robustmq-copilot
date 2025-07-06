import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getUserList } from '@/services/mqtt';

export default function UserList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'username',
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'isSuperUser',
      header: 'Role',
      cell: ({ row }) => (row.original.isSuperUser ? 'Super User' : 'Normal User'),
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    const ret = await getUserList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
    });
    return {
      data: ret.usersList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable columns={columns} fetchDataFn={fetchDataFn} queryKey="QuerySessionListData" />
    </div>
  );
}
