import { CommonLayout } from '@/components/layout/common-layout';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { getClusterStatus } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from '@tanstack/react-router';

export default function MetaService() {
  const navigate = useNavigate();

  const { data: clusterData, isLoading } = useQuery({
    queryKey: ['cluster-status'],
    queryFn: getClusterStatus,
    refetchInterval: 5000,
  });

  const metaEntries = clusterData?.meta ? Object.entries(clusterData.meta) : [];

  return (
    <CommonLayout>
      <div className="mb-4 flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
          <Database className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-purple-600">Meta Service</h1>
        {metaEntries.length > 0 && (
          <Badge variant="outline" className="text-xs">{metaEntries.length} State Machines</Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-purple-600">
              <TableRow className="border-0">
                <TableHead className="text-white font-semibold">Name</TableHead>
                <TableHead className="text-white font-semibold">Membership Configs</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Current Leader</TableHead>
                <TableHead className="text-white font-semibold">Current Term</TableHead>
                <TableHead className="text-white font-semibold">Last Log Index</TableHead>
                <TableHead className="text-white font-semibold">Last Quorum Ack (ms)</TableHead>
                <TableHead className="text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metaEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-400">
                    No meta service data available
                  </TableCell>
                </TableRow>
              ) : (
                metaEntries.map(([key, rs]) => {
                  const isOk = rs.running_state && 'Ok' in rs.running_state;
                  const configs = rs.membership_config?.membership?.configs ?? [];
                  const configStr = configs
                    .map((group: number[]) => `[${group.join(', ')}]`)
                    .join(' / ');

                  return (
                    <TableRow key={key} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium text-sm">{key}</TableCell>
                      <TableCell className="font-mono text-sm">{configStr || '-'}</TableCell>
                      <TableCell>
                        {isOk ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                            <CheckCircle2 className="h-3 w-3 mr-1" />OK
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                            <AlertCircle className="h-3 w-3 mr-1" />Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{rs.current_leader ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{rs.current_term ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{rs.last_log_index ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {rs.millis_since_quorum_ack != null ? rs.millis_since_quorum_ack : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-md px-1.5 py-0.5 h-6 text-[11px]"
                          onClick={() =>
                            navigate({
                              to: '/system/meta-service/$stateMachineName',
                              params: { stateMachineName: key },
                              state: { raftState: rs } as any,
                            })
                          }
                        >
                          <Eye className="mr-0.5 h-2.5 w-2.5" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </CommonLayout>
  );
}
