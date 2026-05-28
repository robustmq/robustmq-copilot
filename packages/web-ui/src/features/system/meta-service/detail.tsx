import { CommonLayout } from '@/components/layout/common-layout';
import { useParams, useNavigate, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Database,
  RefreshCw,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
} from 'lucide-react';
import { getClusterStatus, type RaftState } from '@/services/mqtt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

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
            <Badge className={
              raftState.state === 'Leader'
                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300'
            }>
              {raftState.state}
            </Badge>
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
                  {Object.entries(raftState.membership_config.membership.nodes).map(([nodeId, nodeData]) => (
                    <div key={nodeId} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                          {nodeId}
                        </div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Node {nodeId}</span>
                      </div>
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{nodeData?.rpc_addr || '-'}</span>
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
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-orange-600" />
                <span>Replication</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(raftState.replication).map(([nodeId, rep]) => (
                  <div key={nodeId} className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-bold">
                        {nodeId}
                      </div>
                      <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Node {nodeId}</span>
                    </div>
                    <span className="text-sm font-mono text-orange-600 dark:text-orange-400">
                      Index: {rep?.index ?? '-'} &nbsp;|&nbsp; Term: {rep?.leader_id?.term ?? '-'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raw JSON */}
        <Card className="border-l-4 border-gray-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Raw JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-auto max-h-96 text-xs font-mono">
              {JSON.stringify(raftState, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </CommonLayout>
  );
}
