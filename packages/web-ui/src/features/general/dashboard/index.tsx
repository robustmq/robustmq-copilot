import { CommonLayout } from '@/components/layout/common-layout';
import { SimpleLineChart } from './components/chart';
import { HeaderCard } from './components/card';
import { CombinedCard } from './components/combined-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Network,
  Hash,
  Bell,
  Download,
  Upload,
  User,
  Users,
  RefreshCw,
  Settings,
  Activity,
  Monitor,
  LayoutDashboard,
  Server,
  BarChart3,
  Eye,
  Plug,
  Database,
  Clock,
  Layers,
  GitBranch,
  Wifi,
  HardDrive,
  Folder,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { getOverviewMetricsData, getOverviewStatusData, getClusterStatus, type RaftState } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { useState } from 'react';

function formatTimestamp(ts: number | string | undefined): string {
  if (!ts) return '-';
  try {
    const num = typeof ts === 'string' ? parseInt(ts) : ts;
    return format(new Date(num * 1000), 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return String(ts);
  }
}

function RaftStateSummaryCard({
  name,
  raftState,
  color,
}: {
  name: string;
  raftState?: RaftState;
  color: 'orange' | 'cyan' | 'indigo';
}) {
  if (!raftState) return null;
  const colorMap = {
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-950',
      border: 'border-orange-200 dark:border-orange-800',
      label: 'text-orange-700 dark:text-orange-400',
      value: 'text-orange-900 dark:text-orange-100',
      badge: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-950',
      border: 'border-cyan-200 dark:border-cyan-800',
      label: 'text-cyan-700 dark:text-cyan-400',
      value: 'text-cyan-900 dark:text-cyan-100',
      badge: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-700',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950',
      border: 'border-indigo-200 dark:border-indigo-800',
      label: 'text-indigo-700 dark:text-indigo-400',
      value: 'text-indigo-900 dark:text-indigo-100',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700',
    },
  };
  const c = colorMap[color];
  const isOk = raftState.running_state && 'Ok' in raftState.running_state;

  return (
    <div className={`p-4 rounded-lg ${c.bg} border ${c.border} space-y-3`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${c.label} uppercase tracking-wide`}>{name}</span>
        <div className="flex items-center gap-2">
          {isOk ? (
            <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              OK
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          )}
          <Badge className={c.badge}>{raftState.state}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div>
          <div className={`text-xs ${c.label} font-medium`}>Leader</div>
          <div className={`text-lg font-bold ${c.value}`}>{raftState.current_leader ?? '-'}</div>
        </div>
        <div>
          <div className={`text-xs ${c.label} font-medium`}>Term</div>
          <div className={`text-lg font-bold ${c.value}`}>{raftState.current_term ?? '-'}</div>
        </div>
        <div>
          <div className={`text-xs ${c.label} font-medium`}>Last Log</div>
          <div className={`text-lg font-bold ${c.value}`}>{raftState.last_log_index ?? '-'}</div>
        </div>
        <div>
          <div className={`text-xs ${c.label} font-medium`}>Quorum Ack (ms)</div>
          <div className={`text-lg font-bold ${c.value}`}>{raftState.millis_since_quorum_ack ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}

function RaftStateDetailPanel({ name, raftState }: { name: string; raftState?: RaftState }) {
  if (!raftState) return null;
  const isOk = raftState.running_state && 'Ok' in raftState.running_state;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{name} State Machine</h3>
        <div className="flex items-center gap-2">
          {isOk ? (
            <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              OK
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300">
              <AlertCircle className="h-3 w-3 mr-1" />
              {JSON.stringify(raftState.running_state)}
            </Badge>
          )}
          <Badge
            className={
              raftState.state === 'Leader'
                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300'
                : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300'
            }
          >
            {raftState.state}
          </Badge>
        </div>
      </div>

      {/* Basic Raft Info */}
      <Card className="border-l-4 border-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            <GitBranch className="h-4 w-4 text-purple-600" />
            <span>Raft State</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Node ID</label>
              <div className="text-sm font-medium mt-0.5">{raftState.id}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Leader</label>
              <div className="text-sm font-medium mt-0.5">{raftState.current_leader ?? '-'}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Term</label>
              <div className="text-sm font-medium mt-0.5">{raftState.current_term ?? '-'}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Last Log Index</label>
              <div className="text-sm font-medium mt-0.5">{raftState.last_log_index ?? '-'}</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Quorum Ack (ms)</label>
              <div className="text-sm font-medium mt-0.5">{raftState.millis_since_quorum_ack ?? '-'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vote */}
      {raftState.vote && (
        <Card className="border-l-4 border-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span>Vote</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Leader Node</label>
                <div className="text-sm font-medium mt-0.5">{raftState.vote.leader_id?.node_id ?? '-'}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Term</label>
                <div className="text-sm font-medium mt-0.5">{raftState.vote.leader_id?.term ?? '-'}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Committed</label>
                <div className="mt-0.5">
                  <Badge className={raftState.vote.committed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {raftState.vote.committed ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log Indices */}
      <Card className="border-l-4 border-cyan-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            <FileText className="h-4 w-4 text-cyan-600" />
            <span>Log Indices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Last Applied', data: raftState.last_applied },
              { label: 'Snapshot', data: raftState.snapshot },
              { label: 'Purged', data: raftState.purged },
            ].map((item) => (
              <div
                key={item.label}
                className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{item.label}</div>
                <div className="text-sm font-medium">Index: {item.data?.index ?? '-'}</div>
                {item.data?.leader_id && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    Node {item.data.leader_id.node_id}, Term {item.data.leader_id.term}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Membership */}
      {raftState.membership_config?.membership?.nodes &&
        Object.keys(raftState.membership_config.membership.nodes).length > 0 && (
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>Membership</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(raftState.membership_config.membership.nodes).map(([nodeId, nodeData]) => (
                  <div
                    key={nodeId}
                    className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                        {nodeId}
                      </div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Node {nodeId}</span>
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{nodeData?.rpc_addr || '-'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Replication */}
      {raftState.replication && Object.keys(raftState.replication).length > 0 && (
        <Card className="border-l-4 border-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Database className="h-4 w-4 text-orange-600" />
              <span>Replication</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(raftState.replication).map(([nodeId, rep]) => (
                <div
                  key={nodeId}
                  className="flex items-center justify-between p-2 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold">
                      {nodeId}
                    </div>
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Node {nodeId}</span>
                  </div>
                  <span className="text-xs font-mono text-orange-600 dark:text-orange-400">
                    Index: {rep?.index ?? '-'}, Term: {rep?.leader_id?.term ?? '-'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw JSON */}
      <details className="cursor-pointer">
        <summary className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          View raw JSON
        </summary>
        <pre className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs">
          <code>{JSON.stringify(raftState, null, 2)}</code>
        </pre>
      </details>
    </div>
  );
}

export default function Dashboard() {
  const [metaDetailSheetOpen, setMetaDetailSheetOpen] = useState(false);
  const [brokerDetailSheetOpen, setBrokerDetailSheetOpen] = useState(false);
  const [selectedBrokerNode, setSelectedBrokerNode] = useState<any>(null);

  const { data } = useQuery({
    queryKey: ['overview-metrics'],
    queryFn: getOverviewMetricsData,
    initialData: {
      connectionNum: [],
      topicNum: [],
      subscribeNum: [],
      messageInNum: [],
      messageOutNum: [],
      messageDropNum: [],
    },
    refetchInterval: 5000,
  });

  const { data: statusData } = useQuery({
    queryKey: ['overview-status'],
    queryFn: getOverviewStatusData,
    initialData: {
      clusterName: '',
      messageInRate: 0,
      messageOutRate: 0,
      connectionNum: 0,
      sessionNum: 0,
      topicNum: 0,
      nodesList: [],
      tcpConnectionNum: 0,
      tlsConnectionNum: 0,
      websocketConnectionNum: 0,
      quicConnectionNum: 0,
      subscribeNum: 0,
      exclusiveSubscribeNum: 0,
      shareSubscribeLeaderNum: 0,
      shareSubscribeResubNum: 0,
      exclusiveSubscribeThreadNum: 0,
      shareSubscribeLeaderThreadNum: 0,
      shareSubscribeFollowerThreadNum: 0,
      connectorNum: 0,
      connectorThreadNum: 0,
      shareGroupNum: 0,
      shareSubNum: 0,
      shareSubThreadNum: 0,
    },
    refetchInterval: 5000,
  });

  const { data: clusterData, isLoading: isClusterLoading } = useQuery({
    queryKey: ['cluster-status'],
    queryFn: getClusterStatus,
    refetchInterval: 5000,
  });

  const metaNodes = clusterData?.meta?.meta?.membership_config?.membership?.nodes;
  const metaNodeCount = metaNodes ? Object.keys(metaNodes).length : 0;

  return (
    <CommonLayout>
      <div className="mb-4 flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <Monitor className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-purple-600">Dashboard</h1>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-4">
        <TabsList className="mb-4 w-full h-12 grid grid-cols-3 gap-2">
          <TabsTrigger
            value="overview"
            className="px-6 h-full data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:border-purple-500"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="cluster"
            className="px-6 h-full data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:border-purple-500"
          >
            <Server className="mr-2 h-4 w-4" />
            Cluster
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="px-6 h-full data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 data-[state=active]:border-purple-500"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Health
          </TabsTrigger>
        </TabsList>

        {/* ==================== Overview Tab ==================== */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            <HeaderCard title="Connection" value={statusData.connectionNum} icon={<Network className="h-4 w-4" />} color="blue" />
            <HeaderCard title="Session" value={statusData.sessionNum} icon={<Monitor className="h-4 w-4" />} color="green" />
            <HeaderCard title="Topic" value={statusData.topicNum} icon={<Hash className="h-4 w-4" />} color="orange" />
            <HeaderCard title="Subscription" value={statusData.subscribeNum} icon={<Bell className="h-4 w-4" />} color="purple" />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            <CombinedCard
              title="Connector"
              color="purple"
              items={[
                { label: 'Connector Num', value: statusData.connectorNum, icon: <Plug className="h-3 w-3" /> },
                { label: 'Thread Num', value: statusData.connectorThreadNum, icon: <Activity className="h-3 w-3" /> },
              ]}
            />
            <CombinedCard
              title="Message Rate"
              color="cyan"
              items={[
                { label: 'In Rate', value: statusData.messageInRate, icon: <Download className="h-3 w-3" /> },
                { label: 'Out Rate', value: statusData.messageOutRate, icon: <Upload className="h-3 w-3" /> },
              ]}
            />
            <CombinedCard
              title="Exclusive Subscribe"
              color="pink"
              items={[
                { label: 'Subscriptions', value: statusData.exclusiveSubscribeNum, icon: <User className="h-3 w-3" /> },
                { label: 'Threads', value: statusData.exclusiveSubscribeThreadNum, icon: <Settings className="h-3 w-3" /> },
              ]}
            />
            <Card className="relative overflow-hidden border-l-4 border-green-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-950 dark:to-emerald-950 group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                  Share Subscribe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
                        <Users className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Groups</span>
                    </div>
                    <div className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      {statusData.shareGroupNum}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
                        <Bell className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Subscriptions</span>
                    </div>
                    <div className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      {statusData.shareSubNum}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
                      <Activity className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Threads</span>
                  </div>
                  <div className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    {statusData.shareSubThreadNum}
                  </div>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Card>
          </div>

          <div className="border-t border-purple-200 dark:border-purple-800"></div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <SimpleLineChart title="Message In (Count/Sec)" data={data?.messageInNum || []} color="cyan" />
            <SimpleLineChart title="Message Out (Count/Sec)" data={data?.messageOutNum || []} color="blue" />
            <SimpleLineChart title="Message Drop (Count/Sec)" data={data?.messageDropNum || []} color="orange" />
            <SimpleLineChart title="Connection (Count)" data={data?.connectionNum || []} color="green" />
            <SimpleLineChart title="Topic (Count)" data={data?.topicNum || []} color="purple" />
            <SimpleLineChart title="Subscription (Count)" data={data?.subscribeNum || []} color="pink" />
          </div>
        </TabsContent>

        {/* ==================== Cluster Tab ==================== */}
        <TabsContent value="cluster" className="space-y-4">
          {isClusterLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2 animate-spin" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading cluster status...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cluster Information */}
              <Card className="border-l-4 border-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="h-5 w-5 text-purple-600" />
                    <span>Cluster Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                      <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide block mb-2 text-left">
                        Cluster Name
                      </label>
                      <div className="text-base font-bold text-purple-900 dark:text-purple-100 text-center">
                        {clusterData?.cluster_name || '-'}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide block mb-3 text-left">
                        Nodes
                      </label>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-center flex-1">
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {clusterData?.nodes?.length || 0}
                          </div>
                        </div>
                        <div className="h-8 w-px bg-blue-300 dark:bg-blue-700"></div>
                        <div className="text-center flex-1">
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Meta</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{metaNodeCount}</div>
                        </div>
                        <div className="h-8 w-px bg-blue-300 dark:bg-blue-700"></div>
                        <div className="text-center flex-1">
                          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Broker</div>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {clusterData?.broker_node_list?.length || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                      <label className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide block mb-2 text-left">
                        Version
                      </label>
                      <div className="text-base font-bold text-orange-900 dark:text-orange-100 text-center">
                        {clusterData?.version || '-'}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800">
                      <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide block mb-2 text-left">
                        Start Time
                      </label>
                      <div className="text-sm font-bold text-cyan-900 dark:text-cyan-100 text-center">
                        {formatTimestamp(clusterData?.start_time)}
                      </div>
                    </div>
                  </div>

                  {clusterData?.nodes && clusterData.nodes.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                        <Network className="h-4 w-4 text-purple-600" />
                        <span>Nodes</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {clusterData.nodes.map((nodeIp, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800"
                          >
                            <Server className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="font-mono text-sm text-purple-700 dark:text-purple-300">{nodeIp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Meta Information — Three State Machines */}
              <Card className="border-l-4 border-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-orange-600" />
                      <span>Meta Information</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        3 State Machines
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setMetaDetailSheetOpen(true)} className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RaftStateSummaryCard name="Offset" raftState={clusterData?.meta?.offset} color="orange" />
                  <RaftStateSummaryCard name="MQTT" raftState={clusterData?.meta?.mqtt} color="cyan" />
                  <RaftStateSummaryCard name="Meta" raftState={clusterData?.meta?.meta} color="indigo" />

                  {metaNodes && Object.keys(metaNodes).length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                        <Network className="h-4 w-4 text-orange-600" />
                        <span>Meta Nodes</span>
                      </h3>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-bold">Node ID</TableHead>
                              <TableHead className="font-bold">RPC Address</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(metaNodes).map(([nodeId, nodeData]) => (
                              <TableRow key={nodeId}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center space-x-2">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                                      <Server className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <span className="font-mono text-orange-600 dark:text-orange-400">{nodeId}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-sm">{nodeData?.rpc_addr || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Broker Nodes Table */}
              <Card className="border-l-4 border-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="h-5 w-5 text-blue-600" />
                    <span>Broker Nodes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {clusterData?.broker_node_list && clusterData.broker_node_list.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-bold">Node ID</TableHead>
                            <TableHead className="font-bold">Node IP</TableHead>
                            <TableHead className="font-bold">GRPC Address</TableHead>
                            <TableHead className="font-bold">Roles</TableHead>
                            <TableHead className="font-bold">Start Time</TableHead>
                            <TableHead className="font-bold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clusterData.broker_node_list.map((node, index) => (
                            <TableRow key={node.node_id || index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                    <Server className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span className="font-mono text-blue-600 dark:text-blue-400">{node.node_id}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">{node.node_ip || '-'}</TableCell>
                              <TableCell className="font-mono text-sm">{node.grpc_addr || '-'}</TableCell>
                              <TableCell>
                                {node.roles && node.roles.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {node.roles.map((role, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell className="text-sm">{formatTimestamp(node.start_time)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    setSelectedBrokerNode(node);
                                    setBrokerDetailSheetOpen(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No broker nodes found</div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Meta Detail Sheet */}
          <Sheet open={metaDetailSheetOpen} onOpenChange={setMetaDetailSheetOpen}>
            <SheetContent className="w-[750px] sm:max-w-[750px]">
              <SheetHeader>
                <SheetTitle>Meta Information Detail</SheetTitle>
                <SheetDescription>Three Raft state machines: Offset, MQTT, Meta</SheetDescription>
              </SheetHeader>

              {clusterData?.meta ? (
                <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
                  <Tabs defaultValue="offset" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="offset" className="text-xs">
                        <Database className="h-3 w-3 mr-1" />
                        Offset
                      </TabsTrigger>
                      <TabsTrigger value="mqtt" className="text-xs">
                        <Wifi className="h-3 w-3 mr-1" />
                        MQTT
                      </TabsTrigger>
                      <TabsTrigger value="meta" className="text-xs">
                        <Server className="h-3 w-3 mr-1" />
                        Meta
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="offset">
                      <RaftStateDetailPanel name="Offset" raftState={clusterData.meta.offset} />
                    </TabsContent>
                    <TabsContent value="mqtt">
                      <RaftStateDetailPanel name="MQTT" raftState={clusterData.meta.mqtt} />
                    </TabsContent>
                    <TabsContent value="meta">
                      <RaftStateDetailPanel name="Meta" raftState={clusterData.meta.meta} />
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              ) : (
                <div className="mt-6 text-center py-8 text-gray-500 dark:text-gray-400">No metadata available</div>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* ==================== Health Tab ==================== */}
        <TabsContent value="health" className="space-y-4">
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Dashboard</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Broker Node Detail Sheet */}
      <Sheet open={brokerDetailSheetOpen} onOpenChange={setBrokerDetailSheetOpen}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Broker Node Detail</SheetTitle>
            <SheetDescription>Node ID: {selectedBrokerNode?.node_id ?? '-'}</SheetDescription>
          </SheetHeader>

          {selectedBrokerNode && (
            <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <Card className="border-l-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Server className="h-5 w-5 text-blue-600" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Node ID</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {selectedBrokerNode.node_id ?? '-'}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Node IP</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {selectedBrokerNode.node_ip || '-'}
                        </div>
                      </div>
                    </div>
                    {selectedBrokerNode.roles && selectedBrokerNode.roles.length > 0 && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Roles</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBrokerNode.roles.map((role: string, idx: number) => (
                            <Badge
                              key={idx}
                              className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Network Information */}
                <Card className="border-l-4 border-green-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Network className="h-5 w-5 text-green-600" />
                      <span>Network</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">GRPC Address</label>
                      <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100 mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                        {selectedBrokerNode.grpc_addr || '-'}
                      </div>
                    </div>
                    {selectedBrokerNode.engine_addr && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Engine Address</label>
                        <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100 mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          {selectedBrokerNode.engine_addr}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* MQTT Addresses */}
                {selectedBrokerNode.extend?.mqtt && (
                  <Card className="border-l-4 border-cyan-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Wifi className="h-5 w-5 text-cyan-600" />
                        <span>MQTT Addresses</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(selectedBrokerNode.extend.mqtt).map(([key, value]: [string, any]) =>
                        value ? (
                          <div key={key}>
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100 mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                              {value}
                            </div>
                          </div>
                        ) : null,
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Storage */}
                {selectedBrokerNode.storage_fold && selectedBrokerNode.storage_fold.length > 0 && (
                  <Card className="border-l-4 border-yellow-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <HardDrive className="h-5 w-5 text-yellow-600" />
                        <span>Storage</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedBrokerNode.storage_fold.map((path: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800"
                        >
                          <Folder className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                          <span className="text-sm font-mono text-yellow-700 dark:text-yellow-300">{path}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Time */}
                <Card className="border-l-4 border-orange-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span>Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Start Time</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {formatTimestamp(selectedBrokerNode.start_time)}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Register Time</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {formatTimestamp(selectedBrokerNode.register_time)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Raw JSON */}
                <Card className="border-l-4 border-gray-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <span>Raw JSON</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <details className="cursor-pointer">
                      <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                        Click to view
                      </summary>
                      <pre className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-x-auto text-xs">
                        <code>{JSON.stringify(selectedBrokerNode, null, 2)}</code>
                      </pre>
                    </details>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </CommonLayout>
  );
}
