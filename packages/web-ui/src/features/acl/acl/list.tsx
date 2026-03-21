import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getAclListHttp, AclRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, User, Hash, Globe, Lock, Check, X, Building2, Tag, Eye, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { DeleteAclButton } from './components/delete-acl-button';
import { FilterValue } from '@/components/table/filter';

interface AclListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b last:border-0">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-36 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-100 text-right">{value}</span>
    </div>
  );
}

function AclDetailButton({ acl }: { acl: AclRaw }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-md"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            ACL Rule Detail
          </SheetTitle>
          <SheetDescription>View complete ACL rule information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <FileText className="h-4 w-4 text-purple-600" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Tenant" value={<span className="font-mono font-medium">{acl.tenant}</span>} />
              <InfoRow label="Name" value={<span className="font-mono font-medium">{acl.name}</span>} />
              <InfoRow label="Description" value={acl.desc || <span className="text-gray-400">—</span>} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Access Control</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Resource Type" value={
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
                  {acl.resource_type}
                </Badge>
              } />
              <InfoRow label="Resource Name" value={<span className="font-mono">{acl.resource_name || '—'}</span>} />
              <InfoRow label="Topic" value={<span className="font-mono">{acl.topic || '—'}</span>} />
              <InfoRow label="IP Address" value={<span className="font-mono">{acl.ip || '—'}</span>} />
              <InfoRow label="Action" value={
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  {acl.action}
                </Badge>
              } />
              <InfoRow label="Permission" value={
                <Badge className={acl.permission === 'Allow'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                }>
                  {acl.permission === 'Allow' ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                  {acl.permission}
                </Badge>
              } />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function AclList({ leftActions, extraActions, tenant, onSearch }: AclListProps) {
  const columns: ColumnDef<AclRaw>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Building2 className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{row.original.tenant || '-'}</span>
        </div>
      ),
      size: 130,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-indigo-500" />
          <span className="font-medium text-sm">{row.original.name || '-'}</span>
        </div>
      ),
      size: 180,
    },
    {
      id: 'resource_type',
      accessorKey: 'resource_type',
      header: 'Resource Type',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
        >
          <Shield className="mr-1 h-3 w-3" />
          {row.original.resource_type}
        </Badge>
      ),
    },
    {
      accessorKey: 'resource_name',
      header: 'Resource Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <User className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-sm">{row.original.resource_name || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Hash className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.topic || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'ip',
      header: 'IP Address',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.ip || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          <Lock className="mr-1 h-3 w-3" />
          {row.original.action}
        </Badge>
      ),
    },
    {
      accessorKey: 'permission',
      header: 'Permission',
      cell: ({ row }) => (
        <Badge
          variant={row.original.permission === 'Allow' ? 'default' : 'destructive'}
          className={
            row.original.permission === 'Allow'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm'
          }
        >
          {row.original.permission === 'Allow' ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
          {row.original.permission}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <AclDetailButton acl={row.original} />
          <DeleteAclButton acl={row.original} />
        </div>
      ),
      size: 100,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const nameVal = searchValue.find(f => f.field === 'name' || f.field === '')?.valueList?.[0];
    const ret = await getAclListHttp({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
      ...(tenant ? { tenant } : {}),
      ...(nameVal ? { name: nameVal } : {}),
    });
    return {
      data: ret.aclsList,
      totalCount: ret.totalCount,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryAclListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by ACL name..."
      />

    </div>
  );
}
