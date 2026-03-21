import { useState } from 'react';
import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getTenantList, TenantRaw } from '@/services/mqtt';
import { DeleteTenantButton } from './components/delete-tenant-button';
import { DetailTenantButton } from './components/detail-tenant-button';
import { EditTenantForm } from './components/edit-tenant-form';
import { Building2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

function EditTenantButton({ tenant }: { tenant: TenantRaw }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 transition-all duration-200 rounded-md"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <EditTenantForm tenant={tenant} open={open} onOpenChange={setOpen} />
    </>
  );
}

interface TenantListProps {
  extraActions?: React.ReactNode;
}

export default function TenantList({ extraActions }: TenantListProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'tenant_name',
      header: 'Tenant Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium">{row.original.tenant_name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'desc',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.original.desc || '-'}
        </span>
      ),
    },
    {
      id: 'max_connections_per_node',
      header: 'Max Connections',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.config?.max_connections_per_node?.toLocaleString() ?? '-'}</span>
      ),
    },
    {
      id: 'max_topics',
      header: 'Max Topics',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.config?.max_topics?.toLocaleString() ?? '-'}</span>
      ),
    },
    {
      id: 'max_publish_rate',
      header: 'Max Publish Rate',
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.config?.max_publish_rate != null
            ? `${row.original.config.max_publish_rate.toLocaleString()} /s`
            : '-'}
        </span>
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
        <div className="flex items-center justify-center gap-1">
          <DetailTenantButton tenant={row.original} />
          <EditTenantButton tenant={row.original} />
          <DeleteTenantButton tenantName={row.original.tenant_name} />
        </div>
      ),
      size: 130,
      minSize: 120,
      maxSize: 150,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number) => {
    const ret = await getTenantList({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
    });
    return {
      data: ret.tenantList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey="QueryTenantListData"
        extraActions={extraActions}
        headerClassName="bg-purple-600 text-white"
      />
    </div>
  );
}
