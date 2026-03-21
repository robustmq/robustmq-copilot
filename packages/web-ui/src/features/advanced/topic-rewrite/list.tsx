import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getTopicRewriteListHttp, TopicRewriteRaw, deleteTopicRewrite } from '@/services/mqtt';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowRight, Code, Target, Settings, Trash2, Building2, Tag } from 'lucide-react';
import { ViewTopicRewriteButton } from './components/view-topic-rewrite-button';
import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FilterValue } from '@/components/table/filter';

const ACTION_MAP = {
  All: 'All',
  Publish: 'Publish',
  Subscribe: 'Subscribe',
};

const getActionBadgeStyle = (action: string) => {
  switch (action) {
    case 'All':
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm';
    case 'Publish':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm';
    case 'Subscribe':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm';
  }
};

function DeleteTopicRewriteButton({ rule }: { rule: TopicRewriteRaw }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteTopicRewrite({ tenant: rule.tenant, name: rule.name }),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Topic rewrite rule deleted successfully' });
      queryClient.refetchQueries({ queryKey: ['QueryTopicRewriteListData_all'], exact: false });
    },
    onError: (error: any) => {
      console.error('Failed to delete topic rewrite rule:', error);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Topic Rewrite Rule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this topic rewrite rule? This action cannot be undone.
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Name:</span> {rule.name}</div>
                <div><span className="font-medium">Tenant:</span> {rule.tenant}</div>
                <div><span className="font-medium">Source Topic:</span> {rule.source_topic}</div>
                <div><span className="font-medium">Dest Topic:</span> {rule.dest_topic}</div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface TopicRewriteListProps {
  leftActions?: React.ReactNode;
  extraActions?: React.ReactNode;
  tenant?: string;
  onSearch?: () => void;
}

export default function TopicRewriteList({ leftActions, extraActions, tenant, onSearch }: TopicRewriteListProps) {
  const columns: ColumnDef<TopicRewriteRaw>[] = [
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'source_topic',
      header: 'Source Topic',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm max-w-32 truncate" title={row.original.source_topic}>
            {row.original.source_topic}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'dest_topic',
      header: 'Destination Topic',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <ArrowRight className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-sm max-w-32 truncate" title={row.original.dest_topic}>
            {row.original.dest_topic}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'regex',
      header: 'Regex Pattern',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Code className="h-4 w-4 text-gray-500" />
          <span
            className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded max-w-24 truncate"
            title={row.original.regex}
          >
            {row.original.regex || '-'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Badge variant="default" className={getActionBadgeStyle(row.original.action)}>
          <Settings className="mr-1 h-3 w-3" />
          {ACTION_MAP[row.original.action as keyof typeof ACTION_MAP] || row.original.action}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-center space-x-2">
          <ViewTopicRewriteButton topicRewrite={row.original} />
          <DeleteTopicRewriteButton rule={row.original} />
        </div>
      ),
      size: 120,
      minSize: 100,
      maxSize: 140,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const nameVal = searchValue.find(f => f.field === 'name' || f.field === '')?.valueList?.[0];
    try {
      const ret = await getTopicRewriteListHttp({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(tenant ? { tenant } : {}),
        ...(nameVal ? { name: nameVal } : {}),
      });
      return {
        data: ret.topicRewritesList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch topic rewrite data:', error);
      return { data: [], totalCount: 0 };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey={`QueryTopicRewriteListData_${tenant ?? 'all'}`}
        headerClassName="bg-purple-600 text-white"
        leftActions={leftActions}
        extraActions={extraActions}
        onSearch={onSearch}
        searchPlaceholder="Search by rule name..."
      />
    </div>
  );
}
