import { useLocation, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Info,
  Plug,
  Settings,
  Database,
  FileText,
  Clock,
  Server,
  Activity,
  Share2,
  MessageSquare,

  CheckCircle2,
  XCircle,
  AlertCircle,
  Tag,
  BarChart3,
  Building2,
} from 'lucide-react';
import { CommonLayout } from '@/components/layout/common-layout';
import { getMonitorData, getConnectorDetail, type ConnectorRaw } from '@/services/mqtt';
import { SimpleLineChart } from '@/features/general/dashboard/components/chart';

// 类型映射
const CONNECTOR_TYPE_MAP = {
  kafka: 'Kafka',
  pulsar: 'Pulsar',
  rabbitmq: 'RabbitMQ',
  greptime: 'GreptimeDB',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  file: 'Local File',
};

// 获取连接器类型图标
const getConnectorTypeIcon = (type: string) => {
  const lowerType = type?.toLowerCase() || '';
  switch (lowerType) {
    case 'kafka':
    case 'rabbitmq':
      return MessageSquare;
    case 'pulsar':
      return Share2;
    case 'greptime':
      return Clock;
    case 'postgres':
    case 'mysql':
    case 'mongodb':
      return Database;
    case 'file':
      return FileText;
    default:
      return Plug;
  }
};

// 获取连接器类型 Badge 样式
const getConnectorTypeBadgeStyle = (type: string) => {
  const lowerType = type?.toLowerCase() || '';
  switch (lowerType) {
    case 'kafka':
      return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm';
    case 'pulsar':
      return 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-sm';
    case 'rabbitmq':
      return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm';
    case 'greptime':
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm';
    case 'postgres':
      return 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm';
    case 'mysql':
      return 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm';
    case 'mongodb':
      return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm';
    case 'file':
      return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm';
    default:
      return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm';
  }
};

// 获取状态图标和样式
const getStatusInfo = (status: string) => {
  const lowerStatus = status?.toLowerCase() || '';
  switch (lowerStatus) {
    case 'running':
      return {
        icon: CheckCircle2,
        className: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm',
      };
    case 'stopped':
      return {
        icon: XCircle,
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm',
      };
    case 'error':
      return {
        icon: AlertCircle,
        className: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-sm',
      };
    default:
      return {
        icon: Activity,
        className: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm',
      };
  }
};


export default function ConnectorDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // 从路由 state 中获取 connector 数据
  const connectorData = (location.state as any)?.connectorData as ConnectorRaw | undefined;

  // 获取 Connector Send Success 数据
  const { data: connectorSuccessData } = useQuery({
    queryKey: ['connectorMonitorData', 'connector_send_success_total', connectorData?.connector_name],
    queryFn: () =>
      getMonitorData('connector_send_success_total', undefined, undefined, undefined, connectorData?.connector_name),
    enabled: !!connectorData?.connector_name,
  });

  // 获取 Connector Send Failure 数据
  const { data: connectorFailureData } = useQuery({
    queryKey: ['connectorMonitorData', 'connector_send_failure_total', connectorData?.connector_name],
    queryFn: () =>
      getMonitorData('connector_send_failure_total', undefined, undefined, undefined, connectorData?.connector_name),
    enabled: !!connectorData?.connector_name,
  });

  // 获取 Connector Detail 运行时状态
  const { data: connectorDetailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ['connectorDetail', connectorData?.tenant, connectorData?.connector_name],
    queryFn: () =>
      getConnectorDetail({
        tenant: connectorData?.tenant || '',
        connector_name: connectorData?.connector_name || '',
      }),
    enabled: !!connectorData?.connector_name && !!connectorData?.tenant,
    refetchInterval: 5000,
  });

  if (!connectorData) {
    return (
      <CommonLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connector Not Found</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load connector details. Please try again from the connector list.
            </p>
            <Button onClick={() => navigate({ to: '/data-integration/connector' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Connector List
            </Button>
          </div>
        </div>
      </CommonLayout>
    );
  }

  const TypeIcon = getConnectorTypeIcon(connectorData.connector_type || '');
  const statusInfo = getStatusInfo(connectorData.status || '');
  const StatusIcon = statusInfo.icon;

  return (
    <CommonLayout>
      <div className="container mx-auto p-6 space-y-6 pb-16">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/data-integration/connector' })}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 dark:bg-purple-500">
              <Plug className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {connectorData.connector_name}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="configure" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          {/* ==================== Tab 1: Basic Info ==================== */}
          <TabsContent value="basic" className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <Plug className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                        Connector Name
                      </label>
                      <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                        {connectorData.connector_name}
                      </div>
                    </div>
                  </div>

                  {connectorData.tenant && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
                      <Building2 className="h-4 w-4 text-teal-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide">
                          Tenant
                        </label>
                        <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                          {connectorData.tenant}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <TypeIcon className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                        Connector Type
                      </label>
                      <div className="mt-1">
                        <Badge
                          variant="default"
                          className={getConnectorTypeBadgeStyle(connectorData.connector_type || '')}
                        >
                          <TypeIcon className="mr-1 h-3 w-3" />
                          {CONNECTOR_TYPE_MAP[
                            connectorData.connector_type?.toLowerCase() as keyof typeof CONNECTOR_TYPE_MAP
                          ] || connectorData.connector_type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Activity className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                        Status
                      </label>
                      <div className="mt-1">
                        <Badge variant="default" className={statusInfo.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {connectorData.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {connectorData.topic_name && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                      <Tag className="h-4 w-4 text-cyan-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">
                          Topic Name
                        </label>
                        <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                          {connectorData.topic_name}
                        </div>
                      </div>
                    </div>
                  )}

                  {connectorData.broker_id && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                      <Server className="h-4 w-4 text-indigo-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">
                          Broker ID
                        </label>
                        <div className="mt-1 text-sm font-mono break-all text-gray-900 dark:text-gray-100">
                          {connectorData.broker_id}
                        </div>
                      </div>
                    </div>
                  )}

                  {connectorData.create_time && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <Clock className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                          Created At
                        </label>
                        <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                          {connectorData.create_time}
                        </div>
                      </div>
                    </div>
                  )}

                  {connectorData.update_time && (
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                      <Clock className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide">
                          Updated At
                        </label>
                        <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                          {connectorData.update_time}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Runtime Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Runtime Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isDetailLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                      <span>Loading runtime status...</span>
                    </div>
                  </div>
                ) : connectorDetailData ? (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <Clock className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Last Send Time
                        </label>
                        <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                          {connectorDetailData.last_send_time
                            ? new Date(connectorDetailData.last_send_time * 1000).toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })
                            : '-'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                          Send Success Total
                        </label>
                        <div className="mt-1 text-lg font-mono font-bold text-green-700 dark:text-green-300">
                          {connectorDetailData.send_success_total?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide">
                          Send Fail Total
                        </label>
                        <div className="mt-1 text-lg font-mono font-bold text-red-700 dark:text-red-300">
                          {connectorDetailData.send_fail_total?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                      <MessageSquare className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          Last Message
                        </label>
                        <div className="mt-1 text-sm break-all text-gray-900 dark:text-gray-100">
                          {connectorDetailData.last_msg || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">No runtime status available</p>
                    <p className="text-xs text-gray-400 mt-1">The connector may not be running</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Tab 2: Configure ==================== */}
          <TabsContent value="configure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>
                    {CONNECTOR_TYPE_MAP[
                      connectorData.connector_type?.toLowerCase() as keyof typeof CONNECTOR_TYPE_MAP
                    ] || connectorData.connector_type}{' '}
                    Configuration
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-sm font-mono text-gray-900 dark:text-gray-100 overflow-auto whitespace-pre-wrap break-all">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(connectorData.config || '{}'), null, 2);
                    } catch {
                      return connectorData.config || '-';
                    }
                  })()}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== Tab 3: Monitoring ==================== */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SimpleLineChart title="Send Success (Count/Sec)" data={connectorSuccessData || []} color="green" />
              <SimpleLineChart title="Send Failure (Count/Sec)" data={connectorFailureData || []} color="orange" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CommonLayout>
  );
}
