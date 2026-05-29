import { CommonLayout } from '@/components/layout/common-layout';
import { SimpleLineChart } from './components/chart';
import { HeaderCard } from './components/card';
import { CombinedCard } from './components/combined-card';
import {
  Network,
  Hash,
  Bell,
  Download,
  Upload,
  User,
  Users,
  Activity,
  Settings,
  Monitor,
} from 'lucide-react';
import { getOverviewMetricsData, getOverviewStatusData } from '@/services/mqtt';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');

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
      exclusiveSubscribeThreadNum: 0,
      shareSubscribeGroupNum: 0,
      shareSubscribeNum: 0,
      shareSubscribeThreadNum: 0,
      connectorNum: 0,
      connectorThreadNum: 0,
    },
    refetchInterval: 5000,
  });

  return (
    <CommonLayout>
      <div className="mb-4 flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <Monitor className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-purple-600">{t('dashboard')}</h1>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <HeaderCard title={t('connection')} value={statusData.connectionNum} icon={<Network className="h-4 w-4" />} color="blue" />
          <HeaderCard title={t('session')} value={statusData.sessionNum} icon={<Monitor className="h-4 w-4" />} color="green" />
          <HeaderCard title={t('topic')} value={statusData.topicNum} icon={<Hash className="h-4 w-4" />} color="orange" />
          <HeaderCard title={t('subscription')} value={statusData.subscribeNum} icon={<Bell className="h-4 w-4" />} color="purple" />
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          <CombinedCard
            title={t('connector')}
            color="purple"
            items={[
              { label: t('connector_num'), value: statusData.connectorNum, icon: <Network className="h-3 w-3" /> },
              { label: t('thread_num'), value: statusData.connectorThreadNum, icon: <Activity className="h-3 w-3" /> },
            ]}
          />
          <CombinedCard
            title={t('message_rate')}
            color="cyan"
            items={[
              { label: t('in_rate'), value: statusData.messageInRate, icon: <Download className="h-3 w-3" /> },
              { label: t('out_rate'), value: statusData.messageOutRate, icon: <Upload className="h-3 w-3" /> },
            ]}
          />
          <CombinedCard
            title={t('exclusive_subscribe')}
            color="pink"
            items={[
              { label: t('subscriptions'), value: statusData.exclusiveSubscribeNum, icon: <User className="h-3 w-3" /> },
              { label: t('threads'), value: statusData.exclusiveSubscribeThreadNum, icon: <Settings className="h-3 w-3" /> },
            ]}
          />
          <Card className="relative overflow-hidden border-l-4 border-green-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-950 dark:to-emerald-950 group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                {t('share_subscribe')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('groups')}</span>
                  </div>
                  <div className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    {statusData.shareSubscribeGroupNum}
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
                      <Bell className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('subscriptions')}</span>
                  </div>
                  <div className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    {statusData.shareSubscribeNum}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-md group-hover:rotate-12 transition-transform duration-300">
                    <Activity className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('threads')}</span>
                </div>
                <div className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {statusData.shareSubscribeThreadNum}
                </div>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Card>
        </div>

        <div className="border-t border-purple-200 dark:border-purple-800"></div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <SimpleLineChart title={t('msg_in_count_sec')} data={data?.messageInNum || []} color="cyan" />
          <SimpleLineChart title={t('msg_out_count_sec')} data={data?.messageOutNum || []} color="blue" />
          <SimpleLineChart title={t('msg_drop_count_sec')} data={data?.messageDropNum || []} color="orange" />
          <SimpleLineChart title={t('connection_count')} data={data?.connectionNum || []} color="green" />
          <SimpleLineChart title={t('topic_count')} data={data?.topicNum || []} color="purple" />
          <SimpleLineChart title={t('subscription_count')} data={data?.subscribeNum || []} color="pink" />
        </div>
      </div>
    </CommonLayout>
  );
}
