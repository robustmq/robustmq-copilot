import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CommonLayout } from '@/components/layout/common-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Server, Eye } from 'lucide-react';
import { getClusterStatus } from '@/services/mqtt';

export default function Configuration() {
  const navigate = useNavigate();

  const { data: clusterData, isLoading } = useQuery({
    queryKey: ['cluster-status'],
    queryFn: getClusterStatus,
    refetchInterval: 10000,
  });

  const nodes = clusterData?.broker_node_list ?? [];

  return (
    <CommonLayout>
      <div className="mb-6 flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
          <Settings className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-bold text-purple-600">Cluster Configuration</h2>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Broker ID</TableHead>
                <TableHead className="font-bold">HTTP Address</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : nodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-400 text-sm py-8">
                    No broker nodes found.
                  </TableCell>
                </TableRow>
              ) : (
                nodes.map(node => (
                  <TableRow key={node.node_id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                          <Server className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-mono text-purple-600 dark:text-purple-400 font-medium">{node.node_id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{node.http_addr || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-sm px-2 h-7 text-xs"
                        onClick={() =>
                          navigate({
                            to: '/system/configuration/$brokerId',
                            params: { brokerId: String(node.node_id) },
                          })
                        }
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Config
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </CommonLayout>
  );
}
