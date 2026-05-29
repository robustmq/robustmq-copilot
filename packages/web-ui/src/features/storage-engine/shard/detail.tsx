import { useParams, useNavigate, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Info, HardDrive, Layers, Clock, Database, GitFork, Hash, Tag } from 'lucide-react';
import { getShardList, ShardRaw } from '@/services/mqtt';
import { format } from 'date-fns';
import { CommonLayout } from '@/components/layout/common-layout';
import { useTranslation } from 'react-i18next';
import SegmentList from '@/features/storage-engine/segment/list';

export default function ShardDetail() {
  const { t } = useTranslation();
  const { shardName } = useParams({ from: '/_authenticated/storage-engine/shard/$shardName' });
  const navigate = useNavigate();
  const routerState = useRouterState();
  const stateShardData = (routerState.location.state as any)?.shardData as ShardRaw | undefined;

  const { data: fetchedShard, isLoading } = useQuery({
    queryKey: ['shardDetail', shardName],
    queryFn: async () => {
      const ret = await getShardList({ pagination: { offset: 0, limit: 1000 }, shard_name: shardName });
      return (ret.shardList || []).find((s: ShardRaw) => s.shard_name === shardName) ?? null;
    },
    enabled: !stateShardData,
  });

  const shard: ShardRaw | null | undefined = stateShardData ?? fetchedShard;

  if (!stateShardData && isLoading) {
    return (
      <CommonLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('loading')}</div>
        </div>
      </CommonLayout>
    );
  }

  if (!shard) {
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg">{t('shard_not_found', { defaultValue: 'Shard not found' })}</div>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </div>
      </CommonLayout>
    );
  }

  const engineShard = shard.extend?.StorageEngine;
  const status = engineShard?.status;
  const isRun = status === 'Run';

  const formattedCreateTime = (() => {
    try {
      const ct = engineShard?.create_time;
      if (ct) {
        const ts = typeof ct === 'string' ? parseInt(ct) : ct;
        return format(new Date(ts * 1000), 'yyyy-MM-dd HH:mm:ss');
      }
    } catch {
      // ignore
    }
    return '-';
  })();

  const retentionDisplay = (() => {
    const sec = shard.config?.retention_sec;
    if (sec == null) return '-';
    if (sec >= 86400) return `${Math.floor(sec / 86400)} ${t('days')}`;
    if (sec >= 3600) return `${Math.floor(sec / 3600)} ${t('hours')}`;
    return `${sec} ${t('seconds')}`;
  })();

  return (
    <CommonLayout>
      <div className="container mx-auto p-6 space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-4 shadow-sm border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/storage-engine/shard' })}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 dark:bg-purple-500">
                  <HardDrive className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    {t('shard_detail')}
                  </p>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{shard.shard_name}</h1>
                </div>
              </div>
              <Badge
                variant="outline"
                className={
                  isRun
                    ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
                }
              >
                {status || '-'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {t('segment_list')}
            </TabsTrigger>
          </TabsList>

          {/* ==================== Tab 1: Overview ==================== */}
          <TabsContent value="overview" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  <span>{t('basic_information')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex-shrink-0 mt-1">
                      <HardDrive className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        {t('shard_name')}
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {shard.shard_name || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex-shrink-0 mt-1">
                      <Hash className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        {t('shard_uid')}
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {engineShard?.shard_uid || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex-shrink-0 mt-1">
                      <Tag className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                        {t('topic_name')}
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {shard.topic_name || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`h-3 w-3 rounded-full mt-0.5 ${isRun ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                        {t('status')}
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={
                            isRun
                              ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20'
                              : 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20'
                          }
                        >
                          {status || '-'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                    <div className="flex-shrink-0 mt-1">
                      <Database className="h-4 w-4 text-cyan-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">
                        {t('storage_type')}
                      </label>
                      <div className="mt-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {shard.config?.storage_type || '-'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex-shrink-0 mt-1">
                      <GitFork className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                        {t('replica_num')}
                      </label>
                      <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {shard.config?.replica_num ?? '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        {t('retention')}
                      </label>
                      <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {retentionDisplay}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        {t('created_at')}
                      </label>
                      <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                        {formattedCreateTime}
                      </div>
                    </div>
                  </div>

                  {shard.desc && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 md:col-span-2">
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {t('description')}
                        </label>
                        <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">{shard.desc}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Offset */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="h-5 w-5 text-blue-600" />
                  <span>{t('offset')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        {t('start_offset')}
                      </label>
                      <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                        {shard.offset?.start_offset ?? '-'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">
                        {t('end_offset')}
                      </label>
                      <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                        {shard.offset?.end_offset ?? '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segment Sequences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-teal-600" />
                  <span>{t('segment_information')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                      {t('start_seq')}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {engineShard?.start_segment_seq ?? '-'}
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="text-xs text-green-600 dark:text-green-400 mb-1 font-medium">
                      {t('active_seq')}
                    </div>
                    <div className="text-2xl font-semibold text-green-700 dark:text-green-300">
                      {engineShard?.active_segment_seq ?? '-'}
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-1 font-medium">
                      {t('last_seq')}
                    </div>
                    <div className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                      {engineShard?.last_segment_seq ?? '-'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Tab 2: Segments ==================== */}
          <TabsContent value="segments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  <span>{t('segment_list')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SegmentList shardName={shardName} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CommonLayout>
  );
}
