import { useParams, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Info,
  User,
  Clock,
  Hash,
  Server,
  Timer,
  MessageSquare,
  AlertTriangle,
  FileText,
  Calendar,
  LogOut,
  Building2,
} from 'lucide-react';
import { CommonLayout } from '@/components/layout/common-layout';
import { format } from 'date-fns';
import { SimpleLineChart } from '@/features/general/dashboard/components/chart';
import { getMonitorData } from '@/services/mqtt';

// 根据字段名返回对应的图标
const getFieldIcon = (key: string) => {
  const lowerKey = key.toLowerCase();

  if (lowerKey.includes('time')) return <Clock className="h-4 w-4 text-blue-500" />;
  if (lowerKey.includes('id')) return <Hash className="h-4 w-4 text-purple-500" />;
  if (lowerKey.includes('expiry')) return <Timer className="h-4 w-4 text-yellow-500" />;
  if (lowerKey.includes('broker')) return <Server className="h-4 w-4 text-indigo-500" />;
  if (lowerKey.includes('will')) return <MessageSquare className="h-4 w-4 text-orange-500" />;
  if (lowerKey.includes('delay')) return <Clock className="h-4 w-4 text-cyan-500" />;
  if (lowerKey.includes('topic')) return <MessageSquare className="h-4 w-4 text-green-500" />;
  if (lowerKey.includes('qos')) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  if (lowerKey.includes('retain')) return <FileText className="h-4 w-4 text-cyan-500" />;
  if (lowerKey.includes('message')) return <MessageSquare className="h-4 w-4 text-blue-500" />;

  return <Info className="h-4 w-4 text-gray-500" />;
};

// 格式化显示值的辅助函数
const formatValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return '-';

  // 如果是对象，返回 JSON 字符串
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  // 如果是布尔值
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  // 如果字段名包含 time 并且是数字（时间戳），格式化为日期时间
  if (key.toLowerCase().includes('time') && (typeof value === 'number' || !isNaN(Number(value)))) {
    try {
      const timestamp = typeof value === 'string' ? parseInt(value) : value;
      // 时间戳为 0 表示未设置
      if (timestamp === 0 || !timestamp) return '-';
      return format(new Date(timestamp * 1000), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return String(value);
    }
  }

  return String(value);
};

export default function SessionDetail() {
  const { sessionId } = useParams({ from: '/_authenticated/general/session/$sessionId' });
  const location = useLocation();

  // 从路由 state 中获取 session 数据
  const sessionData = (location.state as any)?.sessionData;

  if (!sessionData) {
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg">Session not found</div>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CommonLayout>
    );
  }

  const clientId = sessionData.client_id || sessionId;

  // 获取 Session Message In 数据
  const { data: sessionInData } = useQuery({
    queryKey: ['sessionMonitorData', 'session_in_num', clientId],
    queryFn: () => getMonitorData('session_in_num', undefined, clientId),
    enabled: !!clientId,
  });

  // 获取 Session Message Out 数据
  const { data: sessionOutData } = useQuery({
    queryKey: ['sessionMonitorData', 'session_out_num', clientId],
    queryFn: () => getMonitorData('session_out_num', undefined, clientId),
    enabled: !!clientId,
  });

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
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Session - Client ID
                  </p>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{clientId}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-purple-600" />
              <span>Session Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {/* Client ID */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Hash className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Client ID
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {sessionData.client_id}
                  </div>
                </div>
              </div>

              {/* Tenant */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Building2 className="h-4 w-4 text-purple-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Tenant
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {sessionData.tenant || '-'}
                  </div>
                </div>
              </div>

              {/* Connection ID */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Hash className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Connection ID
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {sessionData.connection_id || '-'}
                  </div>
                </div>
              </div>

              {/* Session Expiry */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Timer className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Session Expiry
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {sessionData.session_expiry ? `${sessionData.session_expiry}s` : '-'}
                  </div>
                </div>
              </div>

              {/* Broker ID */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Server className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Broker ID
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {sessionData.broker_id || '-'}
                  </div>
                </div>
              </div>

              {/* Create Time */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Calendar className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Created At
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {formatValue('create_time', sessionData.create_time)}
                  </div>
                </div>
              </div>

              {/* Reconnect Time */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-4 w-4 text-cyan-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Reconnect Time
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {formatValue('reconnect_time', sessionData.reconnect_time)}
                  </div>
                </div>
              </div>

              {/* Disconnect Time */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <LogOut className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Disconnect Time
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {formatValue('distinct_time', sessionData.distinct_time)}
                  </div>
                </div>
              </div>

              {/* Last Will Delay Interval */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Last Will Delay Interval
                  </label>
                  <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                    {sessionData.last_will_delay_interval ? `${sessionData.last_will_delay_interval}s` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Message Statistics Charts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SimpleLineChart title="Session Message In (Count/Sec)" data={sessionInData} color="cyan" />
          <SimpleLineChart title="Session Message Out (Count/Sec)" data={sessionOutData} color="blue" />
        </div>

        {/* Last Will 信息 */}
        <Card className="border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Last Will Message</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Last Will Message */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Message Details</span>
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {['topic', 'message', 'qos', 'retain'].map(key => {
                  const value = sessionData.last_will?.last_will?.[key];
                  return (
                    <div
                      key={key}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800"
                    >
                      <div className="flex-shrink-0 mt-1">{getFieldIcon(key)}</div>
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                          {value === undefined || value === null
                            ? '-'
                            : typeof value === 'boolean'
                              ? value
                                ? 'Yes'
                                : 'No'
                              : String(value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Last Will Properties */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                <Info className="h-4 w-4" />
                <span>Properties</span>
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {[
                  'delay_interval',
                  'payload_format_indicator',
                  'message_expiry_interval',
                  'content_type',
                  'response_topic',
                  'correlation_data',
                  'user_properties',
                ].map(key => {
                  const value = sessionData.last_will?.last_will_properties?.[key];
                  return (
                    <div
                      key={key}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex-shrink-0 mt-1">{getFieldIcon(key)}</div>
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                          {value === null || value === undefined
                            ? '-'
                            : typeof value === 'object'
                              ? JSON.stringify(value, null, 2)
                              : String(value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CommonLayout>
  );
}
