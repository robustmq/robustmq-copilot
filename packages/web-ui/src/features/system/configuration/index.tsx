import { useQuery } from '@tanstack/react-query';
import { CommonLayout } from '@/components/layout/common-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Server,
  Wifi,
  Database,
  Shield,
  Zap,
  HardDrive,
  Clock,
  Activity,
  FileText,
  AlertTriangle,
  Gauge,
  Cpu,
  Bot,
} from 'lucide-react';
import { getClusterConfig, ClusterConfig, LimitQuota } from '@/services/mqtt';
import { Skeleton } from '@/components/ui/skeleton';

function ConfigItem({ label, value, mono = true }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      <div className={`p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm truncate ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function BoolItem({ label, value }: { label: string; value?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="mt-1">
        <Badge variant={value ? 'default' : 'secondary'} className={value
          ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
          : 'bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600'}>
          {value ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function LimitSection({ title, quota }: { title: string; quota: LimitQuota }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ConfigItem label="Max Connections / Node" value={quota.max_connections_per_node.toLocaleString()} />
        <ConfigItem label="Max Connection Rate" value={quota.max_connection_rate.toLocaleString()} />
        <ConfigItem label="Max Topics" value={quota.max_topics.toLocaleString()} />
        <ConfigItem label="Max Sessions" value={quota.max_sessions.toLocaleString()} />
        <ConfigItem label="Max Publish Rate" value={quota.max_publish_rate.toLocaleString()} />
      </div>
    </div>
  );
}

export default function Configuration() {
  const { data: config, isLoading, error } = useQuery({
    queryKey: ['cluster-config'],
    queryFn: getClusterConfig,
  });

  if (isLoading) {
    return (
      <CommonLayout>
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-purple-600">Cluster Configuration</h2>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </CommonLayout>
    );
  }

  if (error || !config) {
    return (
      <CommonLayout>
        <div className="mb-6 flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-purple-600">Cluster Configuration</h2>
        </div>
        <Card><CardContent className="pt-6 text-center text-red-600">Failed to load configuration. Please check the server connection.</CardContent></Card>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 shadow-lg">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cluster Configuration</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View cluster configuration settings</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="cluster" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-gray-100 dark:bg-gray-900">
          {[
            { value: 'cluster', icon: Server, label: 'Cluster' },
            { value: 'runtime', icon: Cpu, label: 'Runtime' },
            { value: 'mqtt', icon: Wifi, label: 'MQTT' },
            { value: 'storage', icon: Database, label: 'Storage' },
            { value: 'limits', icon: Gauge, label: 'Limits' },
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value} className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3">
              <Icon className="h-4 w-4" />
              <span className="font-medium">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Cluster Tab */}
        <TabsContent value="cluster" className="space-y-4">
          <Section title="Basic" icon={Server}>
            <ConfigItem label="Cluster Name" value={config.cluster_name} />
            <ConfigItem label="Broker ID" value={config.broker_id} />
            <ConfigItem label="Broker IP" value={config.broker_ip ?? '-'} />
            <ConfigItem label="gRPC Port" value={config.grpc_port} />
            <ConfigItem label="HTTP Port" value={config.http_port} />
            <ConfigItem label="Roles" value={config.roles.join(', ')} mono={false} />
          </Section>

          <Section title="Prometheus" icon={Activity}>
            <BoolItem label="Enable" value={config.prometheus.enable} />
            <ConfigItem label="Port" value={config.prometheus.port} />
          </Section>

          <Section title="Log" icon={FileText}>
            <ConfigItem label="Log Path" value={config.log.log_path} />
            <ConfigItem label="Log Config" value={config.log.log_config} />
          </Section>

          <Section title="pprof" icon={Gauge}>
            <BoolItem label="Enable" value={config.pprof.enable} />
            <ConfigItem label="Port" value={config.pprof.port} />
            <ConfigItem label="Frequency" value={config.pprof.frequency} />
          </Section>

          {config.llm_client && (
            <Section title="LLM Client" icon={Bot}>
              <ConfigItem label="Platform" value={config.llm_client.platform} mono={false} />
              <ConfigItem label="Model" value={config.llm_client.model} mono={false} />
              {config.llm_client.base_url && <ConfigItem label="Base URL" value={config.llm_client.base_url} />}
            </Section>
          )}
        </TabsContent>

        {/* Runtime Tab */}
        <TabsContent value="runtime" className="space-y-4">
          <Section title="Runtime Threads" icon={Cpu}>
            <ConfigItem label="Runtime Worker Threads" value={config.runtime.runtime_worker_threads} />
            <ConfigItem label="Server Worker Threads" value={config.runtime.server_worker_threads} />
            <ConfigItem label="Meta Worker Threads" value={config.runtime.meta_worker_threads} />
            <ConfigItem label="Broker Worker Threads" value={config.runtime.broker_worker_threads} />
            <ConfigItem label="Channels per Address" value={config.runtime.channels_per_address} />
          </Section>

          <Section title="TLS" icon={Shield}>
            <ConfigItem label="TLS Cert" value={config.runtime.tls_cert} />
            <ConfigItem label="TLS Key" value={config.runtime.tls_key} />
          </Section>

          <Section title="Network" icon={Wifi}>
            <ConfigItem label="Accept Thread Num" value={config.network.accept_thread_num} />
            <ConfigItem label="Handler Thread Num" value={config.network.handler_thread_num} />
            <ConfigItem label="Queue Size" value={config.network.queue_size} />
          </Section>

          <Section title="Meta Runtime" icon={Server}>
            <ConfigItem label="Heartbeat Timeout (ms)" value={config.meta_runtime.heartbeat_timeout_ms} />
            <ConfigItem label="Heartbeat Check Interval (ms)" value={config.meta_runtime.heartbeat_check_time_ms} />
            <ConfigItem label="Raft Write Timeout (s)" value={config.meta_runtime.raft_write_timeout_sec} />
            <ConfigItem label="Offset Raft Groups" value={config.meta_runtime.offset_raft_group_num} />
            <ConfigItem label="Data Raft Groups" value={config.meta_runtime.data_raft_group_num} />
          </Section>
        </TabsContent>

        {/* MQTT Tab */}
        <TabsContent value="mqtt" className="space-y-4">
          <Section title="MQTT Server Ports" icon={Wifi}>
            <ConfigItem label="TCP Port" value={config.mqtt_server.tcp_port} />
            <ConfigItem label="TLS Port" value={config.mqtt_server.tls_port} />
            <ConfigItem label="WebSocket Port" value={config.mqtt_server.websocket_port} />
            <ConfigItem label="WebSocket Secure Port" value={config.mqtt_server.websockets_port} />
            <ConfigItem label="QUIC Port" value={config.mqtt_server.quic_port} />
          </Section>

          <Section title="Runtime" icon={Zap}>
            <ConfigItem label="Default User" value={config.mqtt_runtime.default_user} mono={false} />
            <ConfigItem label="Default Password" value={config.mqtt_runtime.default_password} />
            <BoolItem label="Durable Sessions" value={config.mqtt_runtime.durable_sessions_enable} />
            <BoolItem label="Secret Free Login" value={config.mqtt_runtime.secret_free_login} />
            <BoolItem label="Self Protection" value={config.mqtt_runtime.is_self_protection_status} />
          </Section>

          <Section title="Keep Alive" icon={Clock}>
            <BoolItem label="Enable" value={config.mqtt_keep_alive.enable} />
            <ConfigItem label="Default Time (s)" value={config.mqtt_keep_alive.default_time} />
            <ConfigItem label="Max Time (s)" value={config.mqtt_keep_alive.max_time} />
            <ConfigItem label="Timeout Multiplier" value={config.mqtt_keep_alive.default_timeout} />
          </Section>

          <Section title="Protocol" icon={Settings}>
            <ConfigItem label="Max Session Expiry (s)" value={config.mqtt_protocol.max_session_expiry_interval} />
            <ConfigItem label="Default Session Expiry (s)" value={config.mqtt_protocol.default_session_expiry_interval} />
            <ConfigItem label="Topic Alias Max" value={config.mqtt_protocol.topic_alias_max} />
            <ConfigItem label="Max Packet Size (B)" value={config.mqtt_protocol.max_packet_size.toLocaleString()} />
            <ConfigItem label="Receive Max" value={config.mqtt_protocol.receive_max} />
            <ConfigItem label="Max Message Expiry (s)" value={config.mqtt_protocol.max_message_expiry_interval} />
            <BoolItem label="Client PKID Persistent" value={config.mqtt_protocol.client_pkid_persistent} />
          </Section>

          <Section title="Offline Message" icon={HardDrive}>
            <BoolItem label="Enable" value={config.mqtt_offline_message.enable} />
            <ConfigItem label="Expire (ms)" value={config.mqtt_offline_message.expire_ms === 0 ? 'No Expiry' : config.mqtt_offline_message.expire_ms} />
            <ConfigItem label="Max Messages" value={config.mqtt_offline_message.max_messages_num === 0 ? 'Unlimited' : config.mqtt_offline_message.max_messages_num} />
          </Section>

          <Section title="Slow Subscribe" icon={Clock}>
            <BoolItem label="Enable" value={config.mqtt_slow_subscribe.enable} />
            <ConfigItem label="Record Time (ms)" value={config.mqtt_slow_subscribe.record_time} />
            <ConfigItem label="Delay Type" value={config.mqtt_slow_subscribe.delay_type} mono={false} />
          </Section>

          <Section title="Flapping Detect" icon={Activity}>
            <BoolItem label="Enable" value={config.mqtt_flapping_detect.enable} />
            <ConfigItem label="Window Time (min)" value={config.mqtt_flapping_detect.window_time} />
            <ConfigItem label="Max Connections" value={config.mqtt_flapping_detect.max_client_connections} />
            <ConfigItem label="Ban Time (min)" value={config.mqtt_flapping_detect.ban_time} />
          </Section>

          <Section title="Schema Validation" icon={Shield}>
            <BoolItem label="Enable" value={config.mqtt_schema.enable} />
            <ConfigItem label="Strategy" value={config.mqtt_schema.strategy} mono={false} />
            <ConfigItem label="Failed Operation" value={config.mqtt_schema.failed_operation} mono={false} />
            <BoolItem label="Echo Log" value={config.mqtt_schema.echo_log} />
            <ConfigItem label="Log Level" value={config.mqtt_schema.log_level} mono={false} />
          </Section>

          <Section title="System Monitor" icon={AlertTriangle}>
            <BoolItem label="Enable" value={config.mqtt_system_monitor.enable} />
            <ConfigItem label="CPU High Watermark (%)" value={config.mqtt_system_monitor.os_cpu_high_watermark} />
            <ConfigItem label="Memory High Watermark (%)" value={config.mqtt_system_monitor.os_memory_high_watermark} />
            <ConfigItem label="System Topic Interval (ms)" value={config.mqtt_system_monitor.system_topic_interval_ms} />
          </Section>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="space-y-4">
          <Section title="RocksDB" icon={Database}>
            <ConfigItem label="Data Path" value={config.rocksdb.data_path} />
            <ConfigItem label="Max Open Files" value={config.rocksdb.max_open_files.toLocaleString()} />
          </Section>

          <Section title="Storage Runtime" icon={HardDrive}>
            <ConfigItem label="TCP Port" value={config.storage_runtime.tcp_port} />
            <ConfigItem label="Max Segment Size (B)" value={config.storage_runtime.max_segment_size.toLocaleString()} />
            <ConfigItem label="IO Thread Num" value={config.storage_runtime.io_thread_num} />
            <BoolItem label="Offset Cache" value={config.storage_runtime.offset_enable_cache} />
            {config.storage_runtime.data_path.length > 0 && (
              <ConfigItem label="Data Paths" value={config.storage_runtime.data_path.join(', ')} />
            )}
          </Section>
        </TabsContent>

        {/* Limits Tab */}
        <TabsContent value="limits" className="space-y-4">
          <Section title="Cluster Network Limits" icon={Gauge}>
            <ConfigItem label="Max Network Connections" value={config.cluster_limit.max_network_connection.toLocaleString()} />
            <ConfigItem label="Max Connection Rate" value={config.cluster_limit.max_network_connection_rate.toLocaleString()} />
            <ConfigItem label="Max Admin HTTP Rate" value={config.cluster_limit.max_admin_http_uri_rate} />
          </Section>

          <Card>
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">MQTT Limits</span>
              </div>
              <div className="space-y-6">
                <LimitSection title="Cluster" quota={config.mqtt_limit.cluster} />
                <div className="border-t" />
                <LimitSection title="Tenant (Default)" quota={config.mqtt_limit.tenant} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </CommonLayout>
  );
}
