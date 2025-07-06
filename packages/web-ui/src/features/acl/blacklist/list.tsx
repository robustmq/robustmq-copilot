import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getBlacklistList } from '@/services/mqtt';
import { format } from 'date-fns';

const BLACKLIST_TYPE_MAP = {
  CLIENT_ID: 'Client ID',
  USERNAME: 'Username',
  IP_ADDRESS: 'IP Address',
  CLIENT_ID_MATCH: 'Client ID Match',
  USERNAME_MATCH: 'Username Match',
  IP_CIDR: 'IP CIDR',
};

export default function BlackList() {
  const columns: ColumnDef<any>[] = [
    {
      id: 'blacklistType',
      accessorKey: 'blacklistType',
      header: 'Blacklist Type',
      cell: ({ row }) => BLACKLIST_TYPE_MAP[row.original.blacklistType as keyof typeof BLACKLIST_TYPE_MAP],
    },
    {
      accessorKey: 'resourceName',
      header: 'Resource Name',
      cell: ({ row }) => row.original.resourceName || '-',
    },
    {
      accessorKey: 'desc',
      header: 'Description',
      cell: ({ row }) => row.original.desc || '-',
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      cell: ({ row }) => (row.original.endTime ? format(row.original.endTime, 'yyyy-MM-dd HH:mm:ss') : '-'),
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    const ret = await getBlacklistList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
    });
    return {
      data: ret.blacklistsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable columns={columns} fetchDataFn={fetchDataFn} queryKey="QuerySessionListData" />
    </div>
  );
}
