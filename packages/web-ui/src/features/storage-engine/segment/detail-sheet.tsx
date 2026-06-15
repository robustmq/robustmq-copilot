import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getSegmentDetail, SegmentReplicaState } from '@/services/mqtt';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, Server, Download, AlertCircle } from 'lucide-react';

interface SegmentDetailSheetProps {
  shardName: string;
  segmentSeq: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
      <div className="text-sm font-mono">{value ?? '-'}</div>
    </div>
  );
}

function ReplicaCard({ replica }: { replica: SegmentReplicaState }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700 p-3 space-y-3 bg-white dark:bg-gray-800">
      {/* header */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-[10px] shrink-0">
          #{replica.replica_seq}
        </Badge>
        <span className="text-sm font-semibold">
          {t('node_id')}: <span className="font-mono">{replica.node_id}</span>
        </span>
        {replica.is_leader ? (
          <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
            <Crown className="h-3 w-3" /> Leader
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <Download className="h-3 w-3" /> Follower
          </Badge>
        )}
        {replica.in_isr && (
          <Badge variant="outline" className="border-green-500 text-green-600">
            ISR
          </Badge>
        )}
        {!replica.available && (
          <Badge variant="outline" className="border-red-500 text-red-600 gap-1">
            <AlertCircle className="h-3 w-3" /> unavailable
          </Badge>
        )}
      </div>

      {replica.error && (
        <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded p-2 break-all">
          {replica.error}
        </div>
      )}

      {replica.fold && (
        <div className="text-xs">
          <span className="text-gray-400">{t('fold')}: </span>
          <span className="font-mono break-all" title={replica.fold}>{replica.fold}</span>
        </div>
      )}

      {/* offsets / epochs */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="LEO" value={replica.leo} />
        <Stat label="HW" value={replica.high_watermark} />
        <Stat label="Log Start" value={replica.log_start_offset} />
        <Stat label={t('leader_epoch')} value={replica.leader_epoch} />
        <Stat label="Segment Epoch" value={replica.segment_epoch} />
        <Stat label="Role" value={replica.role} />
      </div>

      {/* follower-side fetch process */}
      {replica.fetch && (
        <div className="rounded bg-gray-50 dark:bg-gray-900/40 p-2 space-y-1.5">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
            <Download className="h-3 w-3" /> Fetch
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Stat label="Leader" value={replica.fetch.leader_node_id} />
            <Stat label="Epoch" value={replica.fetch.current_leader_epoch} />
            <Stat label="Fetcher #" value={replica.fetch.fetcher_index} />
            <Stat label="Max Bytes" value={replica.fetch.max_bytes} />
            <Stat
              label="Thread"
              value={
                <Badge
                  variant="outline"
                  className={
                    replica.fetch.thread_running
                      ? 'border-green-500 text-green-600'
                      : 'border-gray-400 text-gray-500'
                  }
                >
                  {replica.fetch.thread_running ? 'running' : 'stopped'}
                </Badge>
              }
            />
          </div>
        </div>
      )}

      {/* leader-side view of follower progress */}
      {replica.follower_progress.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 flex items-center gap-1">
            <Server className="h-3 w-3" /> Follower Progress
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8 text-xs">{t('node_id')}</TableHead>
                  <TableHead className="h-8 text-xs">LEO</TableHead>
                  <TableHead className="h-8 text-xs">Lag</TableHead>
                  <TableHead className="h-8 text-xs">Last Caught Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {replica.follower_progress.map(fp => (
                  <TableRow key={fp.node_id}>
                    <TableCell className="py-1.5 text-xs font-mono">{fp.node_id}</TableCell>
                    <TableCell className="py-1.5 text-xs font-mono">{fp.leo}</TableCell>
                    <TableCell className="py-1.5 text-xs font-mono">
                      <Badge
                        variant="outline"
                        className={fp.lag === 0 ? 'border-green-500 text-green-600' : 'border-yellow-500 text-yellow-600'}
                      >
                        {fp.lag}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-1.5 text-xs font-mono">
                      {fp.last_caught_up_ts ? new Date(fp.last_caught_up_ts * 1000).toLocaleString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SegmentDetailSheet({
  shardName,
  segmentSeq,
  open,
  onOpenChange,
}: SegmentDetailSheetProps) {
  const { t } = useTranslation();

  const { data, isFetching, error } = useQuery({
    queryKey: ['segmentDetail', shardName, segmentSeq],
    queryFn: () => getSegmentDetail(shardName, segmentSeq as number),
    enabled: open && segmentSeq !== null,
    refetchOnWindowFocus: false,
  });

  const seg = data?.segment;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0">
        <SheetHeader className="px-6 pt-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <SheetTitle className="flex items-center gap-2">
            {t('segment_detail')}
            <Badge variant="outline" className="font-mono">#{segmentSeq}</Badge>
          </SheetTitle>
          <SheetDescription className="font-mono text-xs break-all">{shardName}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-90px)]">
          <div className="px-6 py-4 space-y-5">
            {isFetching ? (
              <div className="flex items-center justify-center py-10 gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : error || !data ? (
              <div className="text-sm text-muted-foreground py-10 text-center">
                {error ? String(error) : 'No data.'}
              </div>
            ) : (
              <>
                {/* basic info */}
                <div className="grid grid-cols-3 gap-3">
                  <Stat label={t('status')} value={seg?.status} />
                  <Stat label={t('leader_node')} value={seg?.leader} />
                  <Stat label={t('leader_epoch')} value={seg?.leader_epoch} />
                  <Stat label="Segment Epoch" value={seg?.segment_epoch} />
                  <Stat label={t('replica_count')} value={seg?.replicas?.length ?? 0} />
                  <Stat
                    label="ISR"
                    value={
                      <span className="flex flex-wrap gap-1">
                        {(seg?.isr ?? []).map(n => (
                          <Badge key={n} variant="secondary" className="font-mono text-[10px]">{n}</Badge>
                        ))}
                      </span>
                    }
                  />
                </div>

                {/* per-replica state */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Server className="h-3.5 w-3.5" />
                    <span>{t('replicas')} ({data.replicas.length})</span>
                  </h4>
                  {data.replicas.map(r => (
                    <ReplicaCard key={r.node_id} replica={r} />
                  ))}
                </div>

                {/* segment meta */}
                {data.segment_meta && Object.keys(data.segment_meta).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {t('segment_meta')}
                    </h4>
                    <pre className="text-xs bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded p-3 overflow-auto max-h-48 font-mono">
                      {JSON.stringify(data.segment_meta, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
