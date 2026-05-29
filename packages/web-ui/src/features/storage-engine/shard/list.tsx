import { DataTable } from '@/components/table';
import { ColumnDef } from '@tanstack/react-table';
import { getShardList, ShardRaw } from '@/services/mqtt';
import { FilterValue } from '@/components/table/filter';
import { Clock, GitFork, HardDrive, Eye, MessageSquare, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DataTableColumnHeader } from '@/components/table/data-table-column-header';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function ShardList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: ColumnDef<ShardRaw>[] = [
    {
      accessorKey: 'topic_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('topic_name')} />,
      cell: ({ row }) => (
        <div className="flex items-center space-x-1.5 min-w-0">
          <Tag className="h-4 w-4 text-indigo-500 shrink-0" />
          <span className="text-sm truncate" title={row.original.topic_name || ''}>
            {row.original.topic_name || '-'}
          </span>
        </div>
      ),
      size: 180,
      minSize: 120,
    },
    {
      accessorKey: 'shard_name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('shard_name')} />,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 shrink-0">
            <HardDrive className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium truncate" title={row.original.shard_name}>
            {row.original.shard_name || '-'}
          </span>
        </div>
      ),
      enableSorting: true,
      size: 220,
      minSize: 160,
    },
    {
      id: 'status',
      header: t('status'),
      cell: ({ row }) => {
        const status = row.original.extend?.StorageEngine?.status;
        const isRun = status === 'Run';
        return (
          <Badge
            variant="outline"
            className={isRun
              ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20'
              : 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
            }
          >
            {status || '-'}
          </Badge>
        );
      },
      size: 110,
      maxSize: 140,
    },
    {
      id: 'storage_type',
      header: t('storage_type'),
      cell: ({ row }) => {
        const storageType = row.original.config?.storage_type;
        return (
          <Badge variant="secondary">
            {storageType || '-'}
          </Badge>
        );
      },
      size: 120,
      maxSize: 160,
    },
    {
      id: 'replica_num',
      header: t('replica_num'),
      cell: ({ row }) => {
        const replicaNum = row.original.config?.replica_num;
        return (
          <div className="flex items-center space-x-1.5">
            <GitFork className="h-4 w-4 text-gray-500 shrink-0" />
            <span className="text-sm">{replicaNum ?? '-'}</span>
          </div>
        );
      },
      size: 110,
      maxSize: 140,
    },
    {
      id: 'desc',
      header: t('description'),
      cell: ({ row }) => {
        const desc = row.original.desc;
        return (
          <div className="flex items-center space-x-1.5 min-w-0 w-[160px]">
            <MessageSquare className="h-4 w-4 text-gray-500 shrink-0" />
            <span className="text-sm truncate" title={desc || ''}>
              {desc || '-'}
            </span>
          </div>
        );
      },
      size: 160,
      maxSize: 160,
    },
    {
      id: 'offset',
      header: t('offset_range'),
      cell: ({ row }) => {
        const offset = row.original.offset;
        if (!offset) return <span className="text-sm text-gray-400">-</span>;
        return (
          <span className="text-sm font-mono">
            {offset.start_offset} ~ {offset.end_offset}
          </span>
        );
      },
      size: 160,
      maxSize: 200,
    },
    {
      id: 'create_time',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('create_time')} />,
      cell: ({ row }) => {
        const createTime = row.original.extend?.StorageEngine?.create_time;
        if (!createTime) return <span className="text-sm text-gray-400">-</span>;
        try {
          const formattedTime = format(new Date(createTime * 1000), 'yyyy-MM-dd HH:mm:ss');
          return (
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-sm font-mono">{formattedTime}</span>
            </div>
          );
        } catch {
          return <span className="text-sm text-gray-400">-</span>;
        }
      },
      size: 180,
      maxSize: 200,
    },
    {
      id: 'actions',
      header: t('actions'),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
            onClick={() =>
              navigate({
                to: '/storage-engine/shard/$shardName',
                params: { shardName: row.original.shard_name },
                state: { shardData: row.original },
              })
            }
          >
            <Eye className="mr-0.5 h-2.5 w-2.5" />
            {t('details_btn')}
          </Button>
        </div>
      ),
      size: 100,
      maxSize: 130,
    },
  ];

  const fetchDataFn = async (pageIndex: number, pageSize: number, searchValue: FilterValue[]) => {
    const shardNameVal = searchValue.find(f => f.field === 'shard_name')?.valueList?.[0];
    const topicNameVal = searchValue.find(f => f.field === 'topic_name' || f.field === '')?.valueList?.[0];
    try {
      const ret = await getShardList({
        pagination: { offset: pageIndex * pageSize, limit: pageSize },
        ...(shardNameVal ? { shard_name: shardNameVal } : {}),
        ...(topicNameVal ? { topic_name: topicNameVal } : {}),
      });
      return {
        data: ret.shardList || [],
        totalCount: ret.totalCount || 0,
      };
    } catch (error) {
      console.error('Failed to fetch shard data:', error);
      return {
        data: [],
        totalCount: 0,
      };
    }
  };

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
      <DataTable
        columns={columns}
        fetchDataFn={fetchDataFn}
        queryKey="QueryShardListData"
        defaultPageSize={20}
        headerClassName="bg-purple-600 text-white"
        searchPlaceholder={t('search_by_shard_name')}
      />
    </div>
  );
}
