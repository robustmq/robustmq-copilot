import { useParams, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Info,
  Share2,
  List,
  RefreshCw,
  Wifi,
  User,
  Route,
  Network,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  Hash,
  Settings,
  Layers,
  BarChart3,
  Play,
  Activity,
  Inbox,
  Eye,
  GitFork,
  Tag,
  Building2,
} from 'lucide-react';
import { CommonLayout } from '@/components/layout/common-layout';
import { useQuery } from '@tanstack/react-query';
import { getSubscribeDetail, getMonitorData, type PushSubscribeItem, type PushThreadItem } from '@/services/mqtt';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SimpleLineChart } from '@/features/general/dashboard/components/chart';
import { useState } from 'react';

// 格式化时间戳（秒级）为可读时间
const formatTimestamp = (timestamp: number | null | undefined): string => {
  if (!timestamp) return '-';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export default function SubscribeDetail() {
  const { subscribeId } = useParams({ from: '/_authenticated/general/subscribe/$subscribeId' });
  const location = useLocation();

  // 从路由 state 中获取订阅数据
  const subscribeData = (location.state as any)?.subscribeData;

  const clientId = subscribeData?.client_id || subscribeId;
  const path = subscribeData?.path;
  const tenant = subscribeData?.tenant;

  // 使用 API 获取订阅详情
  const {
    data: detailData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['subscribeDetail', clientId, path, tenant],
    queryFn: () => getSubscribeDetail({ tenant: tenant, client_id: clientId, path: path }),
    enabled: !!clientId && !!path && !!tenant,
    refetchInterval: 5000,
  });

  // 获取订阅发送成功数据
  const { data: subscribeSuccessData } = useQuery({
    queryKey: ['subscribeMonitorData', 'subscribe_send_success_num', clientId, path],
    queryFn: () => getMonitorData('subscribe_send_success_num', undefined, clientId, path),
    enabled: !!clientId && !!path,
  });

  // 获取订阅发送失败数据
  const { data: subscribeFailureData } = useQuery({
    queryKey: ['subscribeMonitorData', 'subscribe_send_failure_num', clientId, path],
    queryFn: () => getMonitorData('subscribe_send_failure_num', undefined, clientId, path),
    enabled: !!clientId && !!path,
  });

  // Sheet state
  const [subSheetOpen, setSubSheetOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<{ topicName: string; item: PushSubscribeItem } | null>(null);
  const [threadSheetOpen, setThreadSheetOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<{ topicName: string; item: PushThreadItem } | null>(null);

  if (!clientId || !path) {
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg">Missing client ID or subscription path</div>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CommonLayout>
    );
  }

  const subData = detailData?.sub_data;
  const pushSubscribeEntries = subData?.push_subscribe ? Object.entries(subData.push_subscribe) : [];
  const pushThreadEntries = subData?.push_thread ? Object.entries(subData.push_thread) : [];

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
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 dark:bg-purple-500">
                  <List className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Subscribe Detail
                  </p>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{clientId}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{path}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="h-8">
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load subscription details: {error instanceof Error ? error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        {detailData && (
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="push-subscribe" className="flex items-center gap-1.5">
                <Inbox className="h-4 w-4" />
                Push Subscribe
              </TabsTrigger>
              <TabsTrigger value="push-thread" className="flex items-center gap-1.5">
                <Play className="h-4 w-4" />
                Push Thread
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Monitoring
              </TabsTrigger>
            </TabsList>

            {/* ==================== Tab 1: 基本信息 ==================== */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="h-5 w-5 text-purple-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {/* Tenant */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                      <Building2 className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                          Tenant
                        </label>
                        <div className="mt-1 font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                          {tenant || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Client ID */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <User className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                          Client ID
                        </label>
                        <div className="mt-1 font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                          {subData?.client_id || clientId}
                        </div>
                      </div>
                    </div>

                    {/* Path */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <Route className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                          Path
                        </label>
                        <div className="mt-1 font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                          {subData?.path || path}
                        </div>
                      </div>
                    </div>

                    {/* Subscription Type */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                      <Share2 className="h-4 w-4 text-indigo-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                          Sub Type
                        </label>
                        <div className="mt-1">
                          {detailData.share_sub ? (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">
                              <Share2 className="mr-1 h-3 w-3" />
                              Shared
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                            >
                              <User className="mr-1 h-3 w-3" />
                              Exclusive
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Leader ID */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                      <Network className="h-4 w-4 text-cyan-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">
                          Leader ID
                        </label>
                        <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                          {subData?.leader_id || '-'}
                        </div>
                      </div>
                    </div>

                    {/* Push Subscribe Count */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <Inbox className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                          Push Subscribe
                        </label>
                        <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {pushSubscribeEntries.length} topics
                        </div>
                      </div>
                    </div>

                    {/* Push Thread Count */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
                      <Play className="h-4 w-4 text-pink-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-pink-700 dark:text-pink-400 uppercase tracking-wide">
                          Push Thread
                        </label>
                        <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {pushThreadEntries.length} threads
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group Leader Info */}
                  {detailData.group_leader_info && (
                    <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-3 flex items-center">
                        <Network className="h-4 w-4 mr-2 text-gray-500" />
                        Group Leader Info
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-gray-500">Broker ID:</span>
                          <Badge variant="secondary" className="font-mono">
                            {detailData.group_leader_info.broker_id}
                          </Badge>
                        </div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-gray-500">Address:</span>
                          <span className="font-mono text-sm">{detailData.group_leader_info.broker_addr}</span>
                        </div>
                        {detailData.group_leader_info.extend_info && (
                          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-500">Extend:</span>
                            <span className="font-mono text-sm">{detailData.group_leader_info.extend_info}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 从路由 state 带过来的额外信息 */}
                  {subscribeData && (subscribeData.protocol || subscribeData.qos || subscribeData.broker_id) && (
                    <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide block mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-gray-500" />
                        Subscribe List Info
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {subscribeData.protocol && (
                          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Wifi className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-xs text-gray-500">Protocol:</span>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                            >
                              {subscribeData.protocol}
                            </Badge>
                          </div>
                        )}
                        {subscribeData.qos && (
                          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Shield className="h-3.5 w-3.5 text-yellow-500" />
                            <span className="text-xs text-gray-500">QoS:</span>
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300"
                            >
                              {subscribeData.qos}
                            </Badge>
                          </div>
                        )}
                        {subscribeData.broker_id && (
                          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Network className="h-3.5 w-3.5 text-purple-500" />
                            <span className="text-xs text-gray-500">Broker:</span>
                            <Badge variant="secondary" className="font-mono">
                              {subscribeData.broker_id}
                            </Badge>
                          </div>
                        )}
                        {subscribeData.create_time && (
                          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <Clock className="h-3.5 w-3.5 text-pink-500" />
                            <span className="text-xs text-gray-500">Created:</span>
                            <span className="text-sm">{subscribeData.create_time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ==================== Tab 2: Push Subscribe ==================== */}
            <TabsContent value="push-subscribe" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Inbox className="h-5 w-5 text-green-600" />
                    <span>Push Subscribe</span>
                    <span className="ml-2 text-sm text-muted-foreground">({pushSubscribeEntries.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pushSubscribeEntries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Inbox className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm">No push subscribe data</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Topic Name</TableHead>
                            <TableHead>Sub Path</TableHead>
                            <TableHead>Protocol</TableHead>
                            <TableHead>QoS</TableHead>
                            <TableHead>No Local</TableHead>
                            <TableHead>Preserve Retain</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[90px] text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pushSubscribeEntries.map(([topicName, item]) => (
                            <TableRow key={topicName}>
                              <TableCell>
                                <span className="font-mono text-sm font-medium">{item.topic_name}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <span className="font-mono text-sm">{item.sub_path}</span>
                                  {item.rewrite_sub_path && (
                                    <Badge variant="outline" className="text-xs ml-1">
                                      → {item.rewrite_sub_path}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                                >
                                  <Wifi className="mr-1 h-3 w-3" />
                                  {item.protocol}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300"
                                >
                                  <Shield className="mr-1 h-3 w-3" />
                                  {item.qos}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.no_local ? 'default' : 'secondary'} className="text-xs">
                                  {item.no_local ? 'Yes' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.preserve_retain ? 'default' : 'secondary'} className="text-xs">
                                  {item.preserve_retain ? 'Yes' : 'No'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1 text-sm">
                                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{formatTimestamp(item.create_time)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
                                  onClick={() => {
                                    setSelectedSub({ topicName, item });
                                    setSubSheetOpen(true);
                                  }}
                                >
                                  <Eye className="mr-0.5 h-2.5 w-2.5" />
                                  Details
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

            {/* ==================== Tab 3: Push Thread ==================== */}
            <TabsContent value="push-thread" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-orange-600" />
                    <span>Push Thread</span>
                    <span className="ml-2 text-sm text-muted-foreground">({pushThreadEntries.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pushThreadEntries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Play className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm">No push thread data</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Topic Name</TableHead>
                            <TableHead>Bucket ID</TableHead>
                            <TableHead className="text-center">Success</TableHead>
                            <TableHead className="text-center">Error</TableHead>
                            <TableHead>Last Push Time</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="w-[90px] text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pushThreadEntries.map(([topicName, item]) => (
                            <TableRow key={topicName}>
                              <TableCell>
                                <span className="font-mono text-sm font-medium">{topicName}</span>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                  {item.bucket_id}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                                >
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  {item.push_success_record_num.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant="outline"
                                  className={
                                    item.push_error_record_num > 0
                                      ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                                      : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800'
                                  }
                                >
                                  <XCircle className="mr-1 h-3 w-3" />
                                  {item.push_error_record_num.toLocaleString()}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1 text-sm">
                                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{formatTimestamp(item.last_push_time)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1 text-sm">
                                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{formatTimestamp(item.create_time)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
                                  onClick={() => {
                                    setSelectedThread({ topicName, item });
                                    setThreadSheetOpen(true);
                                  }}
                                >
                                  <Eye className="mr-0.5 h-2.5 w-2.5" />
                                  Details
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
                <SimpleLineChart
                  title="Subscribe Send Success (Count/Sec)"
                  data={subscribeSuccessData || []}
                  color="green"
                />
                <SimpleLineChart
                  title="Subscribe Send Failure (Count/Sec)"
                  data={subscribeFailureData || []}
                  color="orange"
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Push Subscribe Detail Sheet */}
      <Sheet open={subSheetOpen} onOpenChange={setSubSheetOpen}>
        <SheetContent className="sm:max-w-[480px] p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <SheetTitle className="flex items-center space-x-2">
              <Inbox className="h-5 w-5 text-green-600" />
              <span>Push Subscribe Details</span>
            </SheetTitle>
            <SheetDescription className="font-mono text-sm">{selectedSub?.item.topic_name}</SheetDescription>
          </SheetHeader>

          {selectedSub && (
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="px-6 py-4 space-y-5">
                {/* Topic Info */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Layers className="h-3.5 w-3.5 mr-1.5" />
                    Topic Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Topic Name</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {selectedSub.item.topic_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Client ID</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {selectedSub.item.client_id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Path Info */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Route className="h-3.5 w-3.5 mr-1.5" />
                    Path Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Sub Path</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {selectedSub.item.sub_path}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rewrite Path</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedSub.item.rewrite_sub_path || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <GitFork className="h-3.5 w-3.5 mr-1.5" />
                        Group Name
                      </span>
                      <span
                        className="font-mono text-xs text-gray-900 dark:text-gray-100 max-w-[220px] truncate"
                        title={selectedSub.item.group_name || ''}
                      >
                        {selectedSub.item.group_name || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Protocol & QoS */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Wifi className="h-3.5 w-3.5 mr-1.5" />
                    Protocol & QoS
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Protocol</div>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                      >
                        <Wifi className="mr-1 h-3 w-3" />
                        {selectedSub.item.protocol}
                      </Badge>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">QoS</div>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300"
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {selectedSub.item.qos}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Settings */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Settings
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">No Local</span>
                      <Badge variant={selectedSub.item.no_local ? 'default' : 'secondary'}>
                        {selectedSub.item.no_local ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Preserve Retain</span>
                      <Badge variant={selectedSub.item.preserve_retain ? 'default' : 'secondary'}>
                        {selectedSub.item.preserve_retain ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Retain Forward Rule</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {selectedSub.item.retain_forward_rule}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Tag className="h-3.5 w-3.5 mr-1.5" />
                        Subscription ID
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedSub.item.subscription_identifier ?? '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Time */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Time
                  </h4>
                  <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Created At</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {formatTimestamp(selectedSub.item.create_time)}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* Push Thread Detail Sheet */}
      <Sheet open={threadSheetOpen} onOpenChange={setThreadSheetOpen}>
        <SheetContent className="sm:max-w-[480px] p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
            <SheetTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-orange-600" />
              <span>Push Thread Details</span>
            </SheetTitle>
            <SheetDescription className="font-mono text-sm">{selectedThread?.topicName}</SheetDescription>
          </SheetHeader>

          {selectedThread && (
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="px-6 py-4 space-y-5">
                {/* Status Overview */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Activity className="h-3.5 w-3.5 mr-1.5" />
                    Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Success</span>
                      </div>
                      <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {selectedThread.item.push_success_record_num.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold">Error</span>
                      </div>
                      <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {selectedThread.item.push_error_record_num.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Identification */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Hash className="h-3.5 w-3.5 mr-1.5" />
                    Identification
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Topic Name</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {selectedThread.topicName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Bucket ID</span>
                      <span className="font-mono text-xs text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {selectedThread.item.bucket_id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t dark:border-gray-700" />

                {/* Time Info */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Time Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                        Last Push Time
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {formatTimestamp(selectedThread.item.last_push_time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Activity className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
                        Last Run Time
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {formatTimestamp(selectedThread.item.last_run_time)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        Created At
                      </span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {formatTimestamp(selectedThread.item.create_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </CommonLayout>
  );
}
