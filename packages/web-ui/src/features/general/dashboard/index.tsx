import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { TopNav } from '@/components/layout/top-nav';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { SimpleLineChart } from './components/chart';
import { HeaderCard } from './components/card';
import {
  Network,
  Hash,
  Bell,
  Download,
  Upload,
  User,
  Users,
  Crown,
  RefreshCw,
  Settings,
  Activity,
  Monitor,
} from 'lucide-react';
import { getOverviewMetricsData, getOverviewStatusData } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { SimpleTable } from './components/table';
import { useMemo } from 'react';

const BrokerNodeColumns = [
  { key: 'nodeId', label: 'Node ID' },
  { key: 'nodeIp', label: 'Node IP' },
  { key: 'nodeInnerAddr', label: 'Node Inner Addr' },
  { key: 'startTime', label: 'Start Time' },
  { key: 'registerTime', label: 'Register Time' },
];

const PlacementCenterColumns = [
  { key: 'node_id', label: 'Node ID' },
  { key: 'rpc_addr', label: 'Node IP' },
];

export default function Dashboard() {
  const { data } = useQuery({
    queryKey: ['overview-metrics'],
    queryFn: () => {
      const now = Math.floor(Date.now() / 1000);
      return getOverviewMetricsData({
        startTime: now - 60 * 60,
        endTime: now,
      });
    },
    initialData: {
      connectionNum: [],
      topicNum: [],
      subscribeNum: [],
      messageInNum: [],
      messageOutNum: [],
      messageDropNum: [],
    },
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
    },
  });

  const placementCenterNodes = useMemo(() => {
    return Object.values(statusData?.placementStatus?.membership_config?.membership?.nodes || {});
  }, [statusData]);

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={[]} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <span className="text-sm text-muted-foreground">Cluster Name: {statusData.clusterName || '-'}</span>
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Meta Service</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleTable columns={PlacementCenterColumns} data={placementCenterNodes} />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Broker Nodes</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SimpleTable columns={BrokerNodeColumns} data={statusData?.nodesList || []} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <HeaderCard
              title="MessageIn Rate"
              value={statusData.messageInRate}
              icon={<Download className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="MessageOut Rate"
              value={statusData.messageOutRate}
              icon={<Upload className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Connection"
              value={statusData.connectionNum}
              icon={<Network className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Session"
              value={statusData.sessionNum}
              icon={<Monitor className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Topic"
              value={statusData.topicNum}
              icon={<Hash className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Subscription"
              value={statusData.subscribeNum}
              icon={<Bell className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Exclusive Subscribe"
              value={statusData.exclusiveSubscribeNum}
              icon={<User className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Share Subscribe Leader"
              value={statusData.shareSubscribeLeaderNum}
              icon={<Crown className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Share Subscribe Resub"
              value={statusData.shareSubscribeResubNum}
              icon={<RefreshCw className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Exclusive Subscribe Thread"
              value={statusData.exclusiveSubscribeThreadNum}
              icon={<Settings className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Share Subscribe Leader Thread"
              value={statusData.shareSubscribeLeaderThreadNum}
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
            <HeaderCard
              title="Share Subscribe Follower Thread"
              value={statusData.shareSubscribeFollowerThreadNum}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <SimpleLineChart title="MessageIn Rate" data={data?.messageInNum || []} />
            <SimpleLineChart title="MessageOut Rate" data={data?.messageOutNum || []} />
            <SimpleLineChart title="MessageDrop" data={data?.messageDropNum || []} />
            <SimpleLineChart title="Connection" data={data?.connectionNum || []} />
            <SimpleLineChart title="Topic" data={data?.topicNum || []} />
            <SimpleLineChart title="Subscription" data={data?.subscribeNum || []} />
          </div>
        </div>
      </Main>
    </>
  );
}
