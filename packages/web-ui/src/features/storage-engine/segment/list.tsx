import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  Row,
} from '@tanstack/react-table';
import { getSegmentList, SegmentRaw } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronRight, ChevronDown, HardDrive, Server, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SegmentDetailSheet from '@/features/storage-engine/segment/detail-sheet';

interface SegmentListProps {
  shardName: string;
}

function ExpandedSegmentDetail({ row }: { row: Row<SegmentRaw> }) {
  const { t } = useTranslation();
  const seg = row.original.segment;
  const meta = row.original.segment_meta;

  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-700 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Replicas */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center space-x-1">
            <Server className="h-3.5 w-3.5" />
            <span>{t('replicas')}</span>
          </h4>
          {seg?.replicas && seg.replicas.length > 0 ? (
            <div className="space-y-1.5">
              {seg.replicas.map((replica, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-2 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs"
                >
                  <Badge variant="outline" className="font-mono shrink-0 text-[10px]">
                    #{replica.replica_seq ?? i}
                  </Badge>
                  <span className="text-gray-500 shrink-0">{t('node_id')}:</span>
                  <span className="font-mono">{replica.node_id ?? '-'}</span>
                  {replica.fold && (
                    <>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500 shrink-0">{t('fold')}:</span>
                      <span className="font-mono truncate" title={replica.fold}>{replica.fold}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>

        <div className="space-y-4">
          {/* ISR */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              ISR
            </h4>
            {seg?.isr && seg.isr.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {seg.isr.map((nodeId, i) => (
                  <Badge key={i} variant="secondary" className="font-mono text-[10px]">
                    {nodeId}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">-</span>
            )}
          </div>

          {/* Leader Epoch */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {t('leader_epoch')}
            </h4>
            <span className="text-sm font-mono">{seg?.leader_epoch ?? '-'}</span>
          </div>
        </div>
      </div>

      {/* Segment Meta */}
      {meta && Object.keys(meta).length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center space-x-1">
            <HardDrive className="h-3.5 w-3.5" />
            <span>{t('segment_meta')}</span>
          </h4>
          <pre className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3 overflow-auto max-h-40 font-mono">
            {JSON.stringify(meta, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function SegmentList({ shardName }: SegmentListProps) {
  const { t } = useTranslation();
  const [detailSeq, setDetailSeq] = React.useState<number | null>(null);

  const { data: segmentList, isFetching } = useQuery({
    queryKey: [`QuerySegmentListData_${shardName}`],
    queryFn: async () => {
      if (!shardName) return [];
      return (await getSegmentList(shardName)) || [];
    },
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<SegmentRaw>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded()
            ? <ChevronDown className="h-4 w-4" />
            : <ChevronRight className="h-4 w-4" />
          }
        </Button>
      ),
      size: 40,
      maxSize: 50,
    },
    {
      id: 'segment_seq',
      header: t('segment_seq'),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono">
          {row.original.segment?.segment_seq ?? '-'}
        </Badge>
      ),
      size: 100,
      maxSize: 130,
    },
    {
      id: 'shard_name',
      header: t('shard_name'),
      cell: ({ row }) => (
        <span className="text-sm truncate" title={row.original.segment?.shard_name}>
          {row.original.segment?.shard_name || '-'}
        </span>
      ),
      size: 200,
      minSize: 140,
    },
    {
      id: 'status',
      header: t('status'),
      cell: ({ row }) => {
        const status = row.original.segment?.status;
        let className = '';
        switch (status) {
          case 'Write':
            className = 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20';
            break;
          case 'SealUp':
            className = 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            break;
          case 'PreSealUp':
            className = 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            break;
          case 'PreDelete':
          case 'Deleting':
            className = 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20';
            break;
          default:
            className = 'border-gray-400 text-gray-500';
        }
        return (
          <Badge variant="outline" className={className}>
            {status || '-'}
          </Badge>
        );
      },
      size: 110,
      maxSize: 140,
    },
    {
      id: 'leader',
      header: t('leader_node'),
      cell: ({ row }) => (
        <span className="text-sm font-mono">{row.original.segment?.leader ?? '-'}</span>
      ),
      size: 100,
      maxSize: 130,
    },
    {
      id: 'replica_count',
      header: t('replica_count'),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.segment?.replicas?.length ?? 0}</span>
      ),
      size: 90,
      maxSize: 120,
    },
    {
      id: 'isr_count',
      header: t('isr_count'),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.segment?.isr?.length ?? 0}</span>
      ),
      size: 90,
      maxSize: 120,
    },
    {
      id: 'detail',
      header: t('details'),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-purple-600 hover:text-purple-700"
          onClick={(e) => {
            e.stopPropagation();
            setDetailSeq(row.original.segment?.segment_seq ?? null);
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          {t('details')}
        </Button>
      ),
      size: 90,
      maxSize: 110,
    },
  ];

  const table = useReactTable({
    data: segmentList || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const colCount = columns.length;

  return (
    <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-purple-600 text-white">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="border-0">
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-white font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <React.Fragment key={row.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={row.getToggleExpandedHandler()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={colCount} className="p-0">
                        <ExpandedSegmentDetail row={row} />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SegmentDetailSheet
        shardName={shardName}
        segmentSeq={detailSeq}
        open={detailSeq !== null}
        onOpenChange={(o) => {
          if (!o) setDetailSeq(null);
        }}
      />
    </div>
  );
}
