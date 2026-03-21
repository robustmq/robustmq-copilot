import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getSchemaListHttp, SchemaRaw } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { FileCode, FileJson, Database, Code, FileText, MessageSquare, Building2 } from 'lucide-react';
import { DeleteSchemaButton } from './components/delete-schema-button';
import { DetailSchemaButton } from './components/detail-schema-button';
import { FilterValue } from '@/components/table/filter';

const SCHEMA_TYPE_MAP = {
  json: 'JSON',
  avro: 'Avro',
  protobuf: 'Protobuf',
  xml: 'XML',
};

const getSchemaTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'json': return FileJson;
    case 'avro': return Database;
    case 'protobuf': return Code;
    case 'xml': return FileCode;
    default: return FileText;
  }
};

const getSchemaTypeBadgeStyle = (type: string) => {
  switch (type.toLowerCase()) {
    case 'json': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm';
    case 'avro': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm';
    case 'protobuf': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm';
    case 'xml': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm';
  }
};

interface SchemaListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function SchemaList({ leftActions, extraActions, tenant, onSearch }: SchemaListProps) {
  const columns: ColumnDef<SchemaRaw>[] = [
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
      header: 'Schema Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <FileCode className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'schema_type',
      header: 'Schema Type',
      cell: ({ row }) => {
        const type = row.original.schema_type;
        const Icon = getSchemaTypeIcon(type);
        return (
          <Badge variant="default" className={getSchemaTypeBadgeStyle(type)}>
            <Icon className="mr-1 h-3 w-3" />
            {SCHEMA_TYPE_MAP[type as keyof typeof SCHEMA_TYPE_MAP] || type}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'desc',
      header: 'Description',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-muted-foreground max-w-48 truncate" title={row.original.desc}>
            {row.original.desc || '-'}
          </span>
        </div>
      ),
    },
    {
      id: 'schema_definition',
      header: 'Schema Definition',
      cell: ({ row }) => {
        const schema = row.original.schema || '';
        const truncated = schema.length > 50 ? schema.substring(0, 50) + '...' : schema;
        return (
          <div className="flex items-center space-x-2">
            <Code className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-muted-foreground max-w-64 truncate font-mono" title={schema}>
              {truncated || '-'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-2">
          <DetailSchemaButton schema={row.original} />
          <DeleteSchemaButton schema={row.original} />
        </div>
      ),
      size: 140,
      minSize: 120,
      maxSize: 160,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const nameVal = searchValue.find(f => f.field === 'name' || f.field === '')?.valueList?.[0];
    try {
      const ret = await getSchemaListHttp({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(tenant ? { tenant } : {}),
        ...(nameVal ? { name: nameVal } : {}),
      });
      return {
        data: ret.schemasList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch schema data:', error);
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QuerySchemaListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by schema name..."
      />
    </div>
  );
}
