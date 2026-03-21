import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CommonLayout } from '@/components/layout/common-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { createConnector, getTenantList } from '@/services/mqtt';
import {
  ArrowLeft, Plug, Save, Database, MessageSquare, Share2, Clock,
  FileText, Server, Search, Webhook, Cloud, Radio, Building2,
  Tag, AlertTriangle, Settings2, CheckCircle2,
} from 'lucide-react';

const CONNECTOR_TYPES = [
  { value: 'kafka',         label: 'Kafka',        icon: MessageSquare, description: 'Streaming',       hex: '#3b82f6', color: 'bg-blue-100 text-blue-700 border-blue-200',        activeColor: 'border-blue-500 bg-blue-50' },
  { value: 'pulsar',        label: 'Pulsar',        icon: Share2,        description: 'Messaging',       hex: '#06b6d4', color: 'bg-cyan-100 text-cyan-700 border-cyan-200',         activeColor: 'border-cyan-500 bg-cyan-50' },
  { value: 'rabbitmq',      label: 'RabbitMQ',      icon: MessageSquare, description: 'Message broker',  hex: '#f97316', color: 'bg-orange-100 text-orange-700 border-orange-200',   activeColor: 'border-orange-500 bg-orange-50' },
  { value: 'mqtt',          label: 'MQTT Bridge',   icon: Radio,         description: 'MQTT bridge',     hex: '#22c55e', color: 'bg-green-100 text-green-700 border-green-200',      activeColor: 'border-green-500 bg-green-50' },
  { value: 'redis',         label: 'Redis',         icon: Database,      description: 'Cache/DB',        hex: '#ef4444', color: 'bg-red-100 text-red-700 border-red-200',            activeColor: 'border-red-500 bg-red-50' },
  { value: 'mysql',         label: 'MySQL',         icon: Database,      description: 'Relational DB',   hex: '#0ea5e9', color: 'bg-sky-100 text-sky-700 border-sky-200',            activeColor: 'border-sky-500 bg-sky-50' },
  { value: 'postgres',      label: 'PostgreSQL',    icon: Database,      description: 'Relational DB',   hex: '#6366f1', color: 'bg-indigo-100 text-indigo-700 border-indigo-200',   activeColor: 'border-indigo-500 bg-indigo-50' },
  { value: 'mongodb',       label: 'MongoDB',       icon: Database,      description: 'Document DB',     hex: '#10b981', color: 'bg-emerald-100 text-emerald-700 border-emerald-200',activeColor: 'border-emerald-500 bg-emerald-50' },
  { value: 'clickhouse',    label: 'ClickHouse',    icon: Database,      description: 'Analytic DB',     hex: '#eab308', color: 'bg-yellow-100 text-yellow-700 border-yellow-200',   activeColor: 'border-yellow-500 bg-yellow-50' },
  { value: 'cassandra',     label: 'Cassandra',     icon: Database,      description: 'Distributed DB',  hex: '#14b8a6', color: 'bg-teal-100 text-teal-700 border-teal-200',         activeColor: 'border-teal-500 bg-teal-50' },
  { value: 'elasticsearch', label: 'Elasticsearch', icon: Search,        description: 'Search engine',   hex: '#f59e0b', color: 'bg-amber-100 text-amber-700 border-amber-200',      activeColor: 'border-amber-500 bg-amber-50' },
  { value: 'greptime',      label: 'GreptimeDB',    icon: Clock,         description: 'Time-series',     hex: '#a855f7', color: 'bg-purple-100 text-purple-700 border-purple-200',   activeColor: 'border-purple-500 bg-purple-50' },
  { value: 'influxdb',      label: 'InfluxDB',      icon: Clock,         description: 'Time-series',     hex: '#8b5cf6', color: 'bg-violet-100 text-violet-700 border-violet-200',   activeColor: 'border-violet-500 bg-violet-50' },
  { value: 'opentsdb',      label: 'OpenTSDB',      icon: Clock,         description: 'Time-series',     hex: '#f43f5e', color: 'bg-rose-100 text-rose-700 border-rose-200',         activeColor: 'border-rose-500 bg-rose-50' },
  { value: 'webhook',       label: 'Webhook',       icon: Webhook,       description: 'HTTP push',       hex: '#ec4899', color: 'bg-pink-100 text-pink-700 border-pink-200',         activeColor: 'border-pink-500 bg-pink-50' },
  { value: 's3',            label: 'AWS S3',        icon: Cloud,         description: 'Object storage',  hex: '#f97316', color: 'bg-orange-100 text-orange-700 border-orange-200',   activeColor: 'border-orange-500 bg-orange-50' },
  { value: 'file',          label: 'Local File',    icon: FileText,      description: 'File storage',    hex: '#6b7280', color: 'bg-gray-100 text-gray-700 border-gray-200',         activeColor: 'border-gray-500 bg-gray-50' },
];

type FieldDef = { key: string; label: string; type?: string; placeholder?: string };

const FIELDS_MAP: Record<string, FieldDef[]> = {
  kafka:         [{ key: 'bootstrap_servers', label: 'Bootstrap Servers', placeholder: 'localhost:9092' }, { key: 'topic', label: 'Topic', placeholder: 'mqtt_messages' }],
  pulsar:        [{ key: 'server', label: 'Server', placeholder: 'pulsar://localhost:6650' }, { key: 'topic', label: 'Topic', placeholder: 'mqtt-messages' }],
  rabbitmq:      [{ key: 'server', label: 'Server', placeholder: 'localhost' }, { key: 'username', label: 'Username', placeholder: 'guest' }, { key: 'password', label: 'Password', type: 'password' }, { key: 'exchange', label: 'Exchange', placeholder: 'mqtt_messages' }],
  mqtt:          [{ key: 'server', label: 'Server', placeholder: 'mqtt://remote-broker:1883' }],
  redis:         [{ key: 'server', label: 'Server', placeholder: '127.0.0.1:6379' }, { key: 'command_template', label: 'Command Template', placeholder: 'LPUSH mqtt_messages {payload}' }],
  mysql:         [{ key: 'host', label: 'Host', placeholder: 'localhost' }, { key: 'port', label: 'Port', type: 'number', placeholder: '3306' }, { key: 'database', label: 'Database', placeholder: 'mqtt_data' }, { key: 'username', label: 'Username', placeholder: 'root' }, { key: 'password', label: 'Password', type: 'password' }, { key: 'table', label: 'Table', placeholder: 'mqtt_messages' }],
  postgres:      [{ key: 'host', label: 'Host', placeholder: 'localhost' }, { key: 'port', label: 'Port', type: 'number', placeholder: '5432' }, { key: 'database', label: 'Database', placeholder: 'mqtt_data' }, { key: 'username', label: 'Username', placeholder: 'postgres' }, { key: 'password', label: 'Password', type: 'password' }, { key: 'table', label: 'Table', placeholder: 'mqtt_messages' }],
  mongodb:       [{ key: 'host', label: 'Host', placeholder: 'localhost' }, { key: 'port', label: 'Port', type: 'number', placeholder: '27017' }, { key: 'database', label: 'Database', placeholder: 'mqtt_data' }, { key: 'collection', label: 'Collection', placeholder: 'mqtt_messages' }],
  clickhouse:    [{ key: 'url', label: 'URL', placeholder: 'http://localhost:8123' }, { key: 'database', label: 'Database', placeholder: 'mqtt' }, { key: 'table', label: 'Table', placeholder: 'messages' }],
  cassandra:     [{ key: 'nodes', label: 'Nodes (comma-separated)', placeholder: '127.0.0.1' }, { key: 'keyspace', label: 'Keyspace', placeholder: 'mqtt' }, { key: 'table', label: 'Table', placeholder: 'messages' }],
  elasticsearch: [{ key: 'url', label: 'URL', placeholder: 'http://localhost:9200' }, { key: 'index', label: 'Index', placeholder: 'mqtt_messages' }],
  greptime:      [{ key: 'server_addr', label: 'Server Address', placeholder: 'localhost:4000' }, { key: 'database', label: 'Database', placeholder: 'public' }, { key: 'user', label: 'User', placeholder: '' }, { key: 'password', label: 'Password', type: 'password' }],
  influxdb:      [{ key: 'server', label: 'Server', placeholder: 'http://localhost:8086' }, { key: 'measurement', label: 'Measurement', placeholder: 'mqtt_data' }, { key: 'token', label: 'Token (v2)', placeholder: '' }, { key: 'org', label: 'Org (v2)', placeholder: '' }, { key: 'bucket', label: 'Bucket (v2)', placeholder: '' }],
  opentsdb:      [{ key: 'server', label: 'Server', placeholder: 'http://localhost:4242' }],
  webhook:       [{ key: 'url', label: 'URL', placeholder: 'https://example.com/webhook' }],
  s3:            [{ key: 'bucket', label: 'Bucket', placeholder: 'my-mqtt-bucket' }, { key: 'region', label: 'Region', placeholder: 'us-east-1' }, { key: 'access_key_id', label: 'Access Key ID', placeholder: '' }, { key: 'secret_access_key', label: 'Secret Access Key', type: 'password' }, { key: 'session_token', label: 'Session Token', placeholder: '' }],
  file:          [{ key: 'local_file_path', label: 'Local File Path', placeholder: '/tmp/mqtt_messages.log' }],
};

const NUMBER_KEYS = new Set(['port', 'max_size_gb']);

function buildConfig(type: string, fields: Record<string, string>): string {
  const obj: Record<string, string | number | string[]> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (!v && v !== '0') continue;
    if (NUMBER_KEYS.has(k)) { const n = Number(v); if (!isNaN(n)) { obj[k] = n; continue; } }
    if (type === 'cassandra' && k === 'nodes') { obj[k] = v.split(',').map(s => s.trim()).filter(Boolean); continue; }
    obj[k] = v;
  }
  return JSON.stringify(obj);
}

// Section 标题组件
function SectionTitle({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${color} mb-4`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function CreateConnector() {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState('');
  const [connectorName, setConnectorName] = useState('');
  const [connectorType, setConnectorType] = useState('');
  const [topicName, setTopicName] = useState('');
  const [configFields, setConfigFields] = useState<Record<string, string>>({});
  const [failureStrategy, setFailureStrategy] = useState<'discard' | 'discard_after_retry' | 'dead_message_queue'>('discard');
  const [retryTimes, setRetryTimes] = useState('3');
  const [waitTimeMs, setWaitTimeMs] = useState('1000');
  const [dlqTopic, setDlqTopic] = useState('dead_letter_queue');

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForCreateConnector'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const createMutation = useMutation({
    mutationFn: createConnector,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Connector created successfully!' });
      navigate({ to: '/data-integration/connector' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error?.message || 'Failed to create connector', variant: 'destructive' });
    },
  });

  const handleConnectorTypeChange = (value: string) => { setConnectorType(value); setConfigFields({}); };
  const handleConfigFieldChange = (field: string, value: string) => setConfigFields(prev => ({ ...prev, [field]: value }));

  const buildFailureStrategy = () => {
    if (failureStrategy === 'discard') return { strategy: 'discard' };
    if (failureStrategy === 'discard_after_retry') return { strategy: 'discard_after_retry', retry_total_times: Number(retryTimes), wait_time_ms: Number(waitTimeMs) };
    return { strategy: 'dead_message_queue', topic_name: dlqTopic, retry_total_times: Number(retryTimes), wait_time_ms: Number(waitTimeMs) };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !connectorName || !connectorType || !topicName) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    createMutation.mutate({ tenant, connector_name: connectorName, connector_type: connectorType, config: buildConfig(connectorType, configFields), topic_name: topicName, failure_strategy: buildFailureStrategy() });
  };

  const fields = useMemo(() => FIELDS_MAP[connectorType] ?? [], [connectorType]);
  const selectedType = CONNECTOR_TYPES.find(t => t.value === connectorType);

  return (
    <CommonLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: '/data-integration/connector' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 shadow-md">
                <Plug className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Create New Connector</h1>
                <p className="text-xs text-gray-500">Bridge MQTT messages to external systems</p>
              </div>
            </div>
          </div>
          {selectedType && (
            <Badge className={`${selectedType.color} border text-xs px-3 py-1`}>
              <selectedType.icon className="mr-1.5 h-3.5 w-3.5" />
              {selectedType.label} selected
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="rounded-xl border border-purple-100 dark:border-purple-900 bg-purple-50/40 dark:bg-purple-950/20 p-5">
            <SectionTitle icon={Building2} label="Basic Information" color="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Tenant <span className="text-red-500">*</span>
                </Label>
                <select
                  value={tenant}
                  onChange={e => setTenant(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-white dark:bg-gray-900 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select tenant</option>
                  {tenants.map(t => (
                    <option key={t.tenant_name} value={t.tenant_name}>{t.tenant_name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Connector Name <span className="text-red-500">*</span>
                </Label>
                <Input className="bg-white dark:bg-gray-900" placeholder="my_connector" value={connectorName} onChange={e => setConnectorName(e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Topic Name <span className="text-red-500">*</span>
                </Label>
                <Input className="bg-white dark:bg-gray-900" placeholder="sensor/+" value={topicName} onChange={e => setTopicName(e.target.value)} />
                <p className="text-xs text-muted-foreground">MQTT topic to bind — supports wildcards <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">+</code> and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">#</code></p>
              </div>
            </div>
          </div>

          {/* Section 2: Connector Type */}
          <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 p-5">
            <SectionTitle icon={Plug} label="Connector Type" color="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" />
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {CONNECTOR_TYPES.map(type => {
                const Icon = type.icon;
                const isSelected = connectorType === type.value;
                return (
                  <div
                    key={type.value}
                    onClick={() => handleConnectorTypeChange(type.value)}
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-2.5 cursor-pointer transition-all duration-150 min-h-[76px] ${isSelected ? type.activeColor + ' border-current shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300'}`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-1 ${isSelected ? 'bg-white/70 dark:bg-black/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-current' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-[11px] font-semibold text-center leading-tight ${isSelected ? 'text-current' : 'text-gray-700 dark:text-gray-300'}`}>{type.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Type-specific config */}
          {connectorType && selectedType && (
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: selectedType.hex + '40', backgroundColor: selectedType.hex + '08' }}
            >
              <div
                className="flex items-center space-x-2 px-3 py-2 rounded-lg mb-4"
                style={{ backgroundColor: selectedType.hex + '18', color: selectedType.hex }}
              >
                <selectedType.icon className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">{selectedType.label} Configuration</span>
              </div>
              {fields.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {fields.map(field => (
                    <div
                      key={field.key}
                      className="space-y-1.5 rounded-lg pl-3 py-1"
                      style={{ borderLeft: `3px solid ${selectedType.hex}60`, backgroundColor: selectedType.hex + '08' }}
                    >
                      <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">{field.label}</Label>
                      <Input className="bg-white dark:bg-gray-900" placeholder={field.placeholder} type={field.type || 'text'} value={configFields[field.key] || ''} onChange={e => handleConfigFieldChange(field.key, e.target.value)} />
                    </div>
                  ))}
                  {connectorType === 'file' && (
                    <>
                      <div
                        className="space-y-1.5 rounded-lg pl-3 py-1"
                        style={{ borderLeft: `3px solid ${selectedType.hex}60`, backgroundColor: selectedType.hex + '08' }}
                      >
                        <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Rotation Strategy</Label>
                        <select
                          value={configFields.rotation_strategy || 'none'}
                          onChange={e => handleConfigFieldChange('rotation_strategy', e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-white dark:bg-gray-900 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="none">None</option>
                          <option value="size">By Size</option>
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                        </select>
                      </div>
                      <div
                        className={`space-y-1.5 rounded-lg pl-3 py-1 ${configFields.rotation_strategy === 'size' ? '' : 'invisible'}`}
                        style={{ borderLeft: `3px solid ${selectedType.hex}60`, backgroundColor: selectedType.hex + '08' }}
                      >
                        <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Max Size (GB)</Label>
                        <Input className="bg-white dark:bg-gray-900" type="number" min="1" max="10" placeholder="1" value={configFields.max_size_gb || ''} onChange={e => handleConfigFieldChange('max_size_gb', e.target.value)} />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>No additional configuration required for {selectedType.label}.</span>
                </div>
              )}
            </div>
          )}

          {/* Section 4: Failure Strategy */}
          <div className="rounded-xl border border-amber-100 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 p-5">
            <SectionTitle icon={AlertTriangle} label="Failure Strategy" color="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" />
            <div className="space-y-4">
              <div className="space-y-1.5 md:w-1/2">
                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Strategy</Label>
                <select
                  value={failureStrategy}
                  onChange={e => setFailureStrategy(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-white dark:bg-gray-900 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="discard">Discard</option>
                  <option value="discard_after_retry">Discard After Retry</option>
                  <option value="dead_message_queue">Dead Message Queue</option>
                </select>
              </div>
              <div className={`grid gap-4 md:grid-cols-2 ${failureStrategy === 'discard' ? 'invisible' : ''}`}>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Retry Times</Label>
                  <Input className="bg-white dark:bg-gray-900" type="number" min="1" value={retryTimes} onChange={e => setRetryTimes(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Wait Time (ms)</Label>
                  <Input className="bg-white dark:bg-gray-900" type="number" min="1" value={waitTimeMs} onChange={e => setWaitTimeMs(e.target.value)} />
                </div>
                <div className={`space-y-1.5 md:col-span-2 ${failureStrategy === 'dead_message_queue' ? '' : 'invisible'}`}>
                  <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Dead Letter Queue Topic</Label>
                  <Input className="bg-white dark:bg-gray-900" value={dlqTopic} onChange={e => setDlqTopic(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/data-integration/connector' })} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !tenant || !connectorName || !connectorType || !topicName}
              className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-md min-w-[150px]"
            >
              {createMutation.isPending ? (
                <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Creating...</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />Create Connector</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </CommonLayout>
  );
}
