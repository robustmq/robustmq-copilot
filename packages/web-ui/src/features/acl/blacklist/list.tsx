import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getBlacklistListHttp, BlacklistRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Shield, User, Hash, Globe, Clock, FileText, Building2, Tag, Eye, ShieldX } from 'lucide-react';
import { DeleteBlacklistButton } from './components/delete-blacklist-button';
import { FilterValue } from '@/components/table/filter';

const BLACKLIST_TYPE_MAP: Record<string, string> = {
  ClientId: 'Client ID',
  User: 'User',
  Ip: 'IP Address',
  ClientIdMatch: 'Client ID Match',
  UserMatch: 'User Match',
  IPCIDR: 'IP CIDR',
};

const getBlacklistTypeIcon = (type: string) => {
  switch (type) {
    case 'ClientId':
    case 'ClientIdMatch':
      return Hash;
    case 'User':
    case 'UserMatch':
      return User;
    case 'Ip':
    case 'IPCIDR':
      return Globe;
    default:
      return Shield;
  }
};

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

function BlacklistDetailButton({ blacklist }: { blacklist: BlacklistRaw }) {
  const Icon = getBlacklistTypeIcon(blacklist.blacklist_type);
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
            <ShieldX className="h-5 w-5 text-purple-600" />
            Blacklist Rule Detail
          </SheetTitle>
          <SheetDescription>View complete blacklist rule information</SheetDescription>
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
              <InfoRow label="Tenant" value={<span className="font-mono font-medium">{blacklist.tenant}</span>} />
              <InfoRow label="Name" value={<span className="font-mono font-medium">{blacklist.name}</span>} />
              <InfoRow label="Description" value={blacklist.desc || <span className="text-gray-400">—</span>} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shield className="h-4 w-4 text-red-500" />
                <span>Block Rule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Blacklist Type" value={
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300">
                  <Icon className="mr-1 h-3 w-3" />
                  {BLACKLIST_TYPE_MAP[blacklist.blacklist_type] || blacklist.blacklist_type}
                </Badge>
              } />
              <InfoRow label="Resource Name" value={<span className="font-mono">{blacklist.resource_name}</span>} />
              <InfoRow label="End Time" value={
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-500" />
                  {blacklist.end_time || '—'}
                </div>
              } />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface BlackListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function BlackList({ leftActions, extraActions, tenant, onSearch }: BlackListProps) {
  const columns: ColumnDef<BlacklistRaw>[] = [
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
      id: 'blacklist_type',
      accessorKey: 'blacklist_type',
      header: 'Blacklist Type',
      cell: ({ row }) => {
        const type = row.original.blacklist_type;
        const Icon = getBlacklistTypeIcon(type);
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
          >
            <Icon className="mr-1 h-3 w-3" />
            {BLACKLIST_TYPE_MAP[type] || type}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'resource_name',
      header: 'Resource Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <FileText className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium font-mono text-sm">{row.original.resource_name || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'end_time',
      header: 'End Time',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm">{row.original.end_time || '-'}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <BlacklistDetailButton blacklist={row.original} />
          <DeleteBlacklistButton blacklist={row.original} />
        </div>
      ),
      size: 100,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const nameVal = searchValue.find(f => f.field === 'name' || f.field === '')?.valueList?.[0];
    const ret = await getBlacklistListHttp({
      pagination: {
        offset: pageIndex * pageSize,
        limit: pageSize,
      },
      ...(tenant ? { tenant } : {}),
      ...(nameVal ? { name: nameVal } : {}),
    });
    return {
      data: ret.blacklistsList || [],
      totalCount: ret.totalCount || 0,
    };
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryBlacklistListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by name..."
      />
    </div>
  );
}
