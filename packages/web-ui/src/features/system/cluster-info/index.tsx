import { CommonLayout } from '@/components/layout/common-layout';
import {
  Network,
  RefreshCw,
  Settings,
  Server,
  Eye,
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
import { getClusterStatus, type RaftState } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function formatTimestamp(ts: number | string | undefined): string {
  if (!ts) return '-';
  try {
    const num = typeof ts === 'string' ? parseInt(ts) : ts;
    return format(new Date(num * 1000), 'yyyy-MM-dd HH:mm:ss');
  } catch {
    return String(ts);
  }
}

function RaftStateDetailPanel({ name, raftState }: { name: string; raftState?: RaftState }) {
  if (!raftState) return null;
  const isOk = raftState.running_state && 'Ok' in raftState.running_state;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{name}</h3>
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
              <div key={item.label} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
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

export default function ClusterInfo() {
  const [brokerDetailSheetOpen, setBrokerDetailSheetOpen] = useState(false);
  const [selectedBrokerNode, setSelectedBrokerNode] = useState<any>(null);
  const { t } = useTranslation('dashboard');

  const { data: clusterData, isLoading: isClusterLoading } = useQuery({
    queryKey: ['cluster-status'],
    queryFn: getClusterStatus,
    refetchInterval: 5000,
  });

  const metaNodes = clusterData?.meta
    ? Object.values(clusterData.meta).flatMap(rs =>
        rs.membership_config?.membership?.nodes
          ? Object.entries(rs.membership_config.membership.nodes)
          : []
      )
    : [];
  const uniqueMetaNodeCount = new Set(metaNodes.map(([id]) => id)).size;

  return (
    <CommonLayout>
      <div className="mb-4 flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
          <Server className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-purple-600">{t('cluster_info')}</h1>
      </div>

      <div className="space-y-4">
        {isClusterLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('loading_cluster_status')}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cluster Information */}
            <Card className="border-l-4 border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-purple-600" />
                  <span>{t('cluster_information')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                    <label className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide block mb-2">
                      {t('cluster_name')}
                    </label>
                    <div className="text-base font-bold text-purple-900 dark:text-purple-100 text-center">
                      {clusterData?.cluster_name || '-'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <label className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide block mb-3">
                      Nodes
                    </label>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-center flex-1">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total</div>
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{clusterData?.nodes?.length || 0}</div>
                      </div>
                      <div className="h-8 w-px bg-blue-300 dark:bg-blue-700" />
                      <div className="text-center flex-1">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Meta</div>
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{uniqueMetaNodeCount}</div>
                      </div>
                      <div className="h-8 w-px bg-blue-300 dark:bg-blue-700" />
                      <div className="text-center flex-1">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Broker</div>
                        <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{clusterData?.broker_node_list?.length || 0}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                    <label className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wide block mb-2">
                      Version
                    </label>
                    <div className="text-base font-bold text-orange-900 dark:text-orange-100 text-center">
                      {clusterData?.version || '-'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800">
                    <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide block mb-2">
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

            {/* Broker Nodes */}
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
                                    <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                                      {role}
                                    </Badge>
                                  ))}
                                </div>
                              ) : '-'}
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
      </div>

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
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedBrokerNode.node_id ?? '-'}</div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Node IP</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{selectedBrokerNode.node_ip || '-'}</div>
                      </div>
                    </div>
                    {selectedBrokerNode.roles && selectedBrokerNode.roles.length > 0 && (
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Roles</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBrokerNode.roles.map((role: string, idx: number) => (
                            <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

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

                {selectedBrokerNode.extend && Object.keys(selectedBrokerNode.extend).length > 0 && (
                  <Card className="border-l-4 border-cyan-500">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Wifi className="h-5 w-5 text-cyan-600" />
                        <span>Protocol Addresses</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(selectedBrokerNode.extend).map(([protocol, addrs]: [string, any]) => (
                        <div key={protocol}>
                          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{protocol}</div>
                          <div className="space-y-1">
                            {Object.entries(addrs).map(([key, value]: [string, any]) =>
                              value ? (
                                <div key={key} className="flex items-center justify-between">
                                  <label className="text-xs text-gray-500 dark:text-gray-400">{key.replace(/_/g, ' ')}</label>
                                  <div className="text-xs font-mono text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded">
                                    {value}
                                  </div>
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

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
                        <div key={idx} className="flex items-center space-x-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                          <Folder className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                          <span className="text-sm font-mono text-yellow-700 dark:text-yellow-300">{path}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card className="border-l-4 border-orange-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span>Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Start Time</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{formatTimestamp(selectedBrokerNode.start_time)}</div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Register Time</label>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">{formatTimestamp(selectedBrokerNode.register_time)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

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
