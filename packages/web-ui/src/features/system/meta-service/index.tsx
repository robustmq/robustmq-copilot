import { CommonLayout } from '@/components/layout/common-layout';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { getClusterStatus } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export default function MetaService() {
  const { t } = useTranslation('dashboard');
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
          <div className="text-center">
            <RefreshCw className="h-8 w-8 mx-auto text-purple-600 dark:text-purple-400 mb-2 animate-spin" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('loading_cluster_status')}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-purple-600 text-white">
              <TableRow className="border-0">
                <TableHead className="text-white font-semibold">Name</TableHead>
                <TableHead className="text-white font-semibold">State</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Node ID</TableHead>
                <TableHead className="text-white font-semibold">Leader</TableHead>
                <TableHead className="text-white font-semibold">Term</TableHead>
                <TableHead className="text-white font-semibold">Last Log Index</TableHead>
                <TableHead className="text-white font-semibold">Quorum Ack (ms)</TableHead>
                <TableHead className="text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metaEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-gray-400">
                    No meta service data available
                  </TableCell>
                </TableRow>
              ) : (
                metaEntries.map(([key, rs]) => {
                  const isOk = rs.running_state && 'Ok' in rs.running_state;
                  return (
                    <TableRow key={key} className="hover:bg-muted/50">
                      <TableCell className="font-mono font-medium">{key}</TableCell>
                      <TableCell>
                        <Badge className={
                          rs.state === 'Leader'
                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300'
                        }>
                          {rs.state}
                        </Badge>
                      </TableCell>
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
                      <TableCell className="font-mono text-sm">{rs.id ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{rs.current_leader ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{rs.current_term ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{rs.last_log_index ?? '-'}</TableCell>
                      <TableCell className="font-mono text-sm">{rs.millis_since_quorum_ack ?? '-'}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-1.5 py-0.5 h-6 text-[11px]"
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
