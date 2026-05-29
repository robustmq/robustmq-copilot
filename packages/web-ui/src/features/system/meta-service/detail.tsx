import { CommonLayout } from '@/components/layout/common-layout';
import { useParams, useNavigate, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  ArrowLeft,
  Database,
  RefreshCw,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Crown,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { getClusterStatus, type RaftState } from '@/services/mqtt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

// ─── Collapsible JSON renderer ────────────────────────────────────────────────

function JsonNode({ value }: { value: unknown }) {
  const [collapsed, setCollapsed] = useState(false);

  if (value === null) return <span className="text-gray-400">null</span>;
  if (value === undefined) return <span className="text-gray-400">undefined</span>;
  if (typeof value === 'boolean') return <span className="text-purple-500 dark:text-purple-400">{value ? 'true' : 'false'}</span>;
  if (typeof value === 'number') return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
  if (typeof value === 'string') return <span className="text-green-600 dark:text-green-400">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-500">[]</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          <span className="ml-0.5 text-gray-500">[{value.length}]</span>
        </button>
        {!collapsed && (
          <span>
            {value.map((item, i) => (
              <div key={i} style={{ paddingLeft: '1.25rem' }}>
                <span className="text-gray-400 select-none">{i}: </span>
                <JsonNode value={item} />
                {i < value.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </span>
        )}
      </span>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-gray-500">{'{}'}</span>;
    return (
      <span>
        <button onClick={() => setCollapsed(c => !c)} className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          <span className="ml-0.5 text-gray-500">{'{'}…{'}'} {entries.length} keys</span>
        </button>
        {!collapsed && (
          <span>
            {entries.map(([k, v], i) => (
              <div key={k} style={{ paddingLeft: '1.25rem' }}>
                <span className="text-rose-500 dark:text-rose-400">"{k}"</span>
                <span className="text-gray-500">: </span>
                <JsonNode value={v} />
                {i < entries.length - 1 && <span className="text-gray-400">,</span>}
              </div>
            ))}
          </span>
        )}
      </span>
    );
  }

  return <span>{String(value)}</span>;
}

export default function MetaServiceDetail() {
  const { t } = useTranslation('dashboard');
  const { stateMachineName } = useParams({ from: '/_authenticated/system/meta-service/$stateMachineName' });
  const navigate = useNavigate();
  const routerState = useRouterState();
  const stateRaft = (routerState.location.state as any)?.raftState as RaftState | undefined;

  const { data: clusterData, isLoading } = useQuery({
    queryKey: ['cluster-status'],
    queryFn: getClusterStatus,
    enabled: !stateRaft,
  });

  const raftState: RaftState | undefined = stateRaft ?? clusterData?.meta?.[stateMachineName];

  if (!stateRaft && isLoading) {
    return (
      <CommonLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('loading_cluster_status')}</p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  if (!raftState) {
    return (
      <CommonLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-lg text-gray-500">State machine not found</p>
          <Button onClick={() => navigate({ to: '/system/meta-service' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CommonLayout>
    );
  }

  const isOk = raftState.running_state && 'Ok' in raftState.running_state;

  return (
    <CommonLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-4 shadow-sm border border-purple-200 dark:border-purple-800 mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/system/meta-service' })}
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 dark:bg-purple-500">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">State Machine</p>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">{stateMachineName}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isOk ? (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                <CheckCircle2 className="h-3 w-3 mr-1" />OK
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                <AlertCircle className="h-3 w-3 mr-1" />Error
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-16">
        {/* Raft State */}
        <Card className="border-l-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-purple-600" />
              <span>Raft State</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Node ID', value: raftState.id },
                { label: 'Current Leader', value: raftState.current_leader ?? '-' },
                { label: 'Current Term', value: raftState.current_term ?? '-' },
                { label: 'Last Log Index', value: raftState.last_log_index ?? '-' },
                { label: 'Quorum Ack (ms)', value: raftState.millis_since_quorum_ack ?? '-' },
                { label: 'Last Quorum Acked', value: raftState.last_quorum_acked ?? '-' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide block mb-1">
                    {item.label}
                  </label>
                  <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vote */}
        {raftState.vote && (
          <Card className="border-l-4 border-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                <span>Vote</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide block mb-1">Leader Node</label>
                  <div className="text-sm font-mono font-medium">{raftState.vote.leader_id?.node_id ?? '-'}</div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide block mb-1">Term</label>
                  <div className="text-sm font-mono font-medium">{raftState.vote.leader_id?.term ?? '-'}</div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <label className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide block mb-1">Committed</label>
                  <Badge className={raftState.vote.committed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                    {raftState.vote.committed ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Log Indices */}
        <Card className="border-l-4 border-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-cyan-600" />
              <span>Log Indices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Last Applied', data: raftState.last_applied },
                { label: 'Snapshot', data: raftState.snapshot },
                { label: 'Purged', data: raftState.purged },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                  <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide block mb-1">{item.label}</label>
                  <div className="text-sm font-medium">Index: <span className="font-mono">{item.data?.index ?? '-'}</span></div>
                  {item.data?.leader_id && (
                    <div className="text-xs text-gray-500 mt-1 font-mono">
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
                <CardTitle className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <span>Membership</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(raftState.membership_config.membership.nodes).map(([nodeId, nodeData]) => {
                    const isLeader = String(raftState.current_leader) === nodeId;
                    return (
                      <div key={nodeId} className={`flex items-center justify-between p-3 rounded-lg border ${
                        isLeader
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 shadow-sm'
                          : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${
                            isLeader ? 'bg-green-500' : 'bg-blue-400'
                          }`}>
                            {nodeId}
                          </div>
                          <span className={`text-sm font-medium ${
                            isLeader ? 'text-green-700 dark:text-green-300' : 'text-blue-700 dark:text-blue-300'
                          }`}>
                            Node {nodeId}
                          </span>
                          {isLeader ? (
                            <Badge className="bg-green-500 text-white border-green-600 dark:bg-green-500 text-xs font-bold px-2 py-0.5 flex items-center gap-1">
                              <Crown className="h-3 w-3" />Leader
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500 border-gray-300 dark:bg-gray-800 dark:text-gray-400 text-xs">
                              Follower
                            </Badge>
                          )}
                        </div>
                        <span className={`text-sm font-mono ${
                          isLeader ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {nodeData?.rpc_addr || '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Replication */}
        <Card className="border-l-4 border-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-orange-600" />
              <span>Replication</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!raftState.replication || Object.keys(raftState.replication).length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                No replication data — only available on the Leader node.
              </p>
            ) : (
              <div className="space-y-2">
                {Object.entries(raftState.replication).map(([nodeId, rep]) => {
                  const isLeader = String(raftState.current_leader) === nodeId;
                  return (
                    <div key={nodeId} className={`flex items-center justify-between p-3 rounded-lg border ${
                      isLeader
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 shadow-sm'
                        : 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold ${
                          isLeader ? 'bg-green-500' : 'bg-orange-400'
                        }`}>
                          {nodeId}
                        </div>
                        <span className={`text-sm font-medium ${
                          isLeader ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'
                        }`}>
                          Node {nodeId}
                        </span>
                        <Badge className={isLeader
                          ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 text-xs'
                          : 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 text-xs'
                        }>
                          {isLeader ? 'Leader' : 'Follower'}
                        </Badge>
                      </div>
                      <span className={`text-sm font-mono ${
                        isLeader ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                      }`}>
                        Index: {rep?.index ?? '-'} &nbsp;|&nbsp; Term: {rep?.leader_id?.term ?? '-'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Raw JSON */}
        <Card className="border-l-4 border-gray-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Raw JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[600px] text-xs font-mono leading-5">
              <JsonNode value={raftState} />
            </div>
          </CardContent>
        </Card>
      </div>
    </CommonLayout>
  );
}
