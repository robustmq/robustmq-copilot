import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { FilterValue } from '@/components/table/filter';
import { getUserList } from '@/services/mqtt';
import { DeleteUserButton } from './components/delete-user-button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { format } from 'date-fns';

interface UserListProps {
  extraActions?: React.ReactNode;
  leftActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function UserList({ extraActions, leftActions, tenant, onSearch }: UserListProps) {
  const columns: ColumnDef<any>[] = [
    {
      id: 'username',
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium">{row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.tenant || '-'}</span>
      ),
    },
    {
      accessorKey: 'is_superuser',
      header: 'Role',
      cell: ({ row }) => (
        <Badge
          variant={row.original.is_superuser ? 'default' : 'secondary'}
          className={
            row.original.is_superuser
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }
        >
          {row.original.is_superuser ? 'Super User' : 'Normal User'}
        </Badge>
      ),
    },
    {
      accessorKey: 'create_time',
      header: 'Create Time',
      cell: ({ row }) => {
        const createTime = row.original.create_time;
        if (!createTime) return <span className="text-gray-500">-</span>;
        try {
          return (
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {format(new Date(createTime * 1000), 'yyyy-MM-dd HH:mm:ss')}
            </span>
          );
        } catch {
          return <span className="text-gray-500">-</span>;
        }
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DeleteUserButton tenant={row.original.tenant} username={row.original.username} isSuperUser={row.original.is_superuser} />
        </div>
      ),
      size: 60,
      minSize: 50,
      maxSize: 80,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const usernameFilter = searchValue.find(f => f.field === 'username' || f.field === '');
    const username = usernameFilter?.valueList?.[0];
    const ret = await getUserList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
      ...(tenant ? { tenant } : {}),
      ...(username ? { user_name: username } : {}),
    });
    return {
      data: ret.usersList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryUserListData_${tenant ?? 'all'}`}
        extraActions={extraActions}
        leftActions={leftActions}
        headerClassName="bg-purple-600 text-white"
        onSearch={onSearch}
        searchPlaceholder="Search by username..."
      />
    </div>
  );
}
