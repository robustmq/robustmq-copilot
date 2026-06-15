import { useParams, useNavigate, useRouterState } from '@tanstack/react-router';
import { decodeRouteId } from '@/utils/routeParam';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Info,
  MessageCircle,
  Clock,
  Users,
  User,
  FileText,
  Link2,
  RefreshCw,
  Trash2,
  Hash,
  Database,
  GitFork,
  HardDrive,
  Layers,
  Box,
  Eye,
  Server,
  BarChart3,
  Building2,
} from 'lucide-react';
import { getTopicDetail, getMonitorData, getSchemaBindList, deleteSchemaBind } from '@/services/mqtt';
import { format } from 'date-fns';
import { CommonLayout } from '@/components/layout/common-layout';
import { SimpleLineChart } from '@/features/general/dashboard/components/chart';
import { BindSchemaButton } from './components/bind-schema-button';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TopicDetail() {
  const { t } = useTranslation();
  const { topicId: rawTopicId } = useParams({ from: '/_authenticated/general/topic/$topicId' });
  const topicId = decodeRouteId(rawTopicId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const stateTenant = (routerState.location.state as any)?.tenant as string | undefined;
  if (stateTenant) {
    sessionStorage.setItem(`topic_tenant_${topicId}`, stateTenant);
  }
  const tenant = stateTenant ?? sessionStorage.getItem(`topic_tenant_${topicId}`) ?? undefined;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [schemaToDelete, setSchemaToDelete] = useState<string | null>(null);
  const [isSchemaRefreshing, setIsSchemaRefreshing] = useState(false);
  const [isSubscriptionRefreshing, setIsSubscriptionRefreshing] = useState(false);

  // 删除 schema 绑定的 mutation
  const deleteBindMutation = useMutation({
    mutationFn: deleteSchemaBind,
    onSuccess: () => {
      toast({
        title: t('success'),
        description: t('schema_binding_deleted'),
      });
      queryClient.invalidateQueries({ queryKey: ['schemaBindList', topicId] });
      setDeleteDialogOpen(false);
      setSchemaToDelete(null);
    },
    onError: (error: any) => {
      console.error('Failed to delete schema binding:', error);
      const errorMessage = error?.message || error?.toString() || 'Failed to delete schema binding';
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleDeleteClick = (schemaName: string) => {
    setSchemaToDelete(schemaName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (schemaToDelete) {
      deleteBindMutation.mutate({
        schema_name: schemaToDelete,
        resource_name: topicId,
      });
    }
  };

  // 调用 topic/detail 接口获取详细信息（topicId 参数实际传的是 topic_name）
  const { data, isLoading, error } = useQuery({
    queryKey: ['topicDetail', topicId, tenant],
    queryFn: async () => {
      console.log('[Topic Detail] Fetching topic detail for:', topicId, 'tenant:', tenant);
      const result = await getTopicDetail(topicId, tenant);
      console.log('[Topic Detail] API Response:', result);
      return result;
    },
  });

  // 获取 Topic Message In 数据
  const { data: topicInData } = useQuery({
    queryKey: ['topicMonitorData', 'topic_in_num', topicId],
    queryFn: () => getMonitorData('topic_in_num', topicId),
    enabled: !!topicId,
  });

  // 获取 Topic Message Out 数据
  const { data: topicOutData } = useQuery({
    queryKey: ['topicMonitorData', 'topic_out_num', topicId],
    queryFn: () => getMonitorData('topic_out_num', topicId),
    enabled: !!topicId,
  });

  // 获取 Schema Bind 数据
  const { data: schemaBindData } = useQuery({
    queryKey: ['schemaBindList', topicId],
    queryFn: () => getSchemaBindList(topicId, undefined),
    enabled: !!topicId,
  });

  if (isLoading) {
    return (
      <CommonLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">{t('loading')}</div>
        </div>
      </CommonLayout>
    );
  }

  if (error) {
    console.error('[Topic Detail] Render error:', error);
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-red-600">{t('error_loading_topic')}</div>
          <div className="text-sm text-gray-600">{String(error)}</div>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </div>
      </CommonLayout>
    );
  }

  if (!data) {
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg">{t('topic_not_found')}</div>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('back')}
          </Button>
        </div>
      </CommonLayout>
    );
  }

  const topicInfo = data?.topic_info;
  const subscriptions = data?.sub_list || [];

  // 格式化创建时间（秒级时间戳）
  const formattedCreateTime = (() => {
    try {
      if (topicInfo?.create_time) {
        const timestamp =
          typeof topicInfo.create_time === 'string' ? parseInt(topicInfo.create_time) : topicInfo.create_time;
        return format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');
      }
    } catch (error) {
      console.error('Error formatting create time:', error);
    }
    return '-';
  })();

  // 格式化 Retain Message At（秒级时间戳）
  const formattedRetainMessageAt = (() => {
    try {
      if (data?.retain_message_at) {
        const timestamp =
          typeof data.retain_message_at === 'string' ? parseInt(data.retain_message_at) : data.retain_message_at;
        // 按秒级时间戳处理，需要 * 1000
        return format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');
      }
    } catch (error) {
      console.error('Error formatting retain message at:', error);
    }
    return '-';
  })();

  // 直接显示 Retain Message 原始内容
  const retainMessage = data?.retain_message || '-';

  return (
    <CommonLayout>
      <div className="container mx-auto p-6 space-y-6 pb-16">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-4 shadow-sm border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 dark:bg-purple-500">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    {t('topic_name')}
                  </p>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {topicInfo?.topic_name || topicId}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center gap-1.5">
              <Link2 className="h-4 w-4" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="subscribe" className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {t('subscribe')}
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              {t('monitoring')}
            </TabsTrigger>
          </TabsList>

          {/* ==================== Tab 1: Overview ==================== */}
          <TabsContent value="overview" className="space-y-6">
            {/* 基本信息 */}
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
                      <Building2 className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        {t('tenant')}
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {tenant || topicInfo?.tenant || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex-shrink-0 mt-1">
                      <Hash className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        {t('topic_id')}
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {topicInfo?.topic_id || '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex-shrink-0 mt-1">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        {t('topic_name')}
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {topicInfo?.topic_name || '-'}
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
                          {topicInfo?.storage_type || '-'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex-shrink-0 mt-1">
                      <GitFork className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                        {t('partition')}
                      </label>
                      <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {topicInfo?.partition ?? '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex-shrink-0 mt-1">
                      <HardDrive className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                        {t('replication')}
                      </label>
                      <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {topicInfo?.replication ?? '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        {t('created_at')}
                      </label>
                      <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                        {formattedCreateTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex-shrink-0 mt-1">
                      <Building2 className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        {t('tenant')}
                      </label>
                      <div className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {tenant || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Storage Name List */}
                {topicInfo?.storage_name_list && Object.keys(topicInfo.storage_name_list).length > 0 && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-2 flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-gray-500" />
                      {t('storage_name_list')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(topicInfo.storage_name_list).map(([partition, name]) => (
                        <div
                          key={partition}
                          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        >
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">
                            P{partition}
                          </Badge>
                          <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Retain Message */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <span>{t('retain_message')}</span>
                  </CardTitle>
                  {data?.retain_message_at && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formattedRetainMessageAt}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono break-all text-gray-900 dark:text-gray-100 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700 max-h-40 overflow-y-auto">
                  {data?.retain_message ? (
                    typeof data.retain_message === 'object' ? (
                      <pre className="whitespace-pre-wrap">{JSON.stringify(data.retain_message, null, 2)}</pre>
                    ) : (
                      String(data.retain_message)
                    )
                  ) : (
                    <span className="text-gray-400 dark:text-gray-600 italic">{t('no_retain_message')}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Partition List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Box className="h-5 w-5 text-teal-600" />
                  <span>{t('partition_list')}</span>
                  {data?.storage_list && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({Object.keys(data.storage_list).length})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!data?.storage_list || Object.keys(data.storage_list).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">{t('no_partition_data')}</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">{t('partition')}</TableHead>
                          <TableHead>{t('shard_name')}</TableHead>
                          <TableHead className="w-[90px]">{t('status')}</TableHead>
                          <TableHead>{t('storage_type')}</TableHead>
                          <TableHead className="w-[80px]">{t('replicas')}</TableHead>
                          <TableHead>{t('segments')}</TableHead>
                          <TableHead>{t('retention')}</TableHead>
                          <TableHead>{t('max_size')}</TableHead>
                          <TableHead className="w-[90px] text-center">{t('actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(data.storage_list).map(([partitionId, shard]) => (
                          <TableRow key={partitionId}>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300"
                              >
                                P{partitionId}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-xs">{shard.shard_name}</span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={shard.status === 'Run' ? 'default' : 'secondary'}
                                className={shard.status === 'Run' ? 'bg-green-500 text-white' : ''}
                              >
                                {shard.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {shard.config.storage_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{shard.config.replica_num}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-xs">
                                <span className="text-gray-500">S:</span>
                                <span>{shard.start_segment_seq}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-green-600 dark:text-green-400">A:</span>
                                <span className="text-green-600 dark:text-green-400">{shard.active_segment_seq}</span>
                                <span className="text-gray-400">/</span>
                                <span className="text-blue-600 dark:text-blue-400">L:</span>
                                <span className="text-blue-600 dark:text-blue-400">{shard.last_segment_seq}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {shard.config.retention_sec >= 86400
                                  ? `${Math.floor(shard.config.retention_sec / 86400)}d`
                                  : shard.config.retention_sec >= 3600
                                    ? `${Math.floor(shard.config.retention_sec / 3600)}h`
                                    : `${shard.config.retention_sec}s`}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {shard.config.max_segment_size >= 1073741824
                                  ? `${(shard.config.max_segment_size / 1073741824).toFixed(1)} GB`
                                  : `${(shard.config.max_segment_size / 1048576).toFixed(0)} MB`}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
                                onClick={() => {
                                  navigate({
                                    to: '/storage-engine/shard/$shardName',
                                    params: { shardName: shard.shard_name },
                                  });
                                }}
                              >
                                <Eye className="mr-0.5 h-2.5 w-2.5" />
                                {t('details_btn')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Tab 2: Schema ==================== */}
          <TabsContent value="schema" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5 text-green-600" />
                    <span>{t('schema_bindings')}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({schemaBindData?.schemaBindList?.[0]?.data?.length || 0})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <BindSchemaButton
                      resourceName={topicId}
                      boundSchemas={schemaBindData?.schemaBindList?.[0]?.data || []}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSchemaRefreshing(true);
                        queryClient.invalidateQueries({ queryKey: ['schemaBindList', topicId] });
                        setTimeout(() => setIsSchemaRefreshing(false), 800);
                      }}
                      disabled={isSchemaRefreshing}
                      className="h-8"
                    >
                      <RefreshCw className={`h-4 w-4 ${isSchemaRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!schemaBindData?.schemaBindList?.length || !schemaBindData.schemaBindList[0]?.data?.length ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Link2 className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">{t('no_schema_bindings')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('bind_schema_hint')}</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">#</TableHead>
                          <TableHead>{t('schema_name')}</TableHead>
                          <TableHead className="w-[100px] text-center">{t('actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schemaBindData.schemaBindList[0].data.map((schemaName, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                              >
                                {index + 1}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                  <FileText className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="font-medium font-mono">{schemaName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-200 rounded-md"
                                  onClick={() => handleDeleteClick(schemaName)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Tab 3: Subscribe ==================== */}
          <TabsContent value="subscribe" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>{t('subscriptions')}</span>
                    <span className="ml-2 text-sm text-muted-foreground">({subscriptions.length})</span>
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSubscriptionRefreshing(true);
                      queryClient.invalidateQueries({ queryKey: ['topicDetail', topicId] });
                      setTimeout(() => setIsSubscriptionRefreshing(false), 800);
                    }}
                    disabled={isSubscriptionRefreshing}
                    className="h-8"
                  >
                    <RefreshCw className={`h-4 w-4 ${isSubscriptionRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">{t('no_subscriptions')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('subscriptions_hint')}</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('client_id')}</TableHead>
                          <TableHead>{t('path')}</TableHead>
                          <TableHead className="w-[90px] text-center">{t('actions')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptions.map((sub, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div
                                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() =>
                                  navigate({
                                    to: '/general/client/$clientId',
                                    params: { clientId: sub.client_id },
                                  })
                                }
                              >
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                  <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium text-purple-600 dark:text-purple-400 hover:underline">
                                  {sub.client_id}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">{sub.path}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
                                onClick={() =>
                                  navigate({
                                    to: '/general/subscribe/$subscribeId',
                                    params: { subscribeId: sub.client_id },
                                    state: {
                                      subscribeData: {
                                        client_id: sub.client_id,
                                        path: sub.path,
                                      },
                                    },
                                  })
                                }
                              >
                                <Eye className="mr-0.5 h-2.5 w-2.5" />
                                {t('details_btn')}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Tab 4: Monitoring ==================== */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SimpleLineChart title={t('topic_message_in')} data={topicInData || []} color="cyan" />
              <SimpleLineChart title={t('topic_message_out')} data={topicOutData || []} color="blue" />
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('delete_schema_binding')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('delete_schema_binding_confirm')} <strong>"{schemaToDelete}"</strong> {t('delete_schema_binding_from')}{' '}
                <strong>"{topicId}"</strong>?
                <br />
                <br />
                {t('delete_schema_binding_desc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={deleteBindMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteBindMutation.isPending ? t('deleting') : t('delete_binding')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CommonLayout>
  );
}
