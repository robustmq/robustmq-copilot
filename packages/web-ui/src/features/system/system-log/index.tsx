import { CommonLayout } from '@/components/layout/common-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollText, Clock, Activity, AlertTriangle, FileX } from 'lucide-react';
import SlowSubscriptionList from '@/features/advanced/slow-subscription/list';
import ConnectionJitterList from '@/features/advanced/connection-jitter/list';
import SystemAlarmList from '@/features/advanced/system-alarm/list';
import BanLogList from '@/features/system/ban-log/list';

export default function SystemLog() {
  return (
    <CommonLayout>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 shadow-lg">
            <ScrollText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">System Log</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor slow subscriptions, connection jitter, system alarms and ban records
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="slow-subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-gray-100 dark:bg-gray-900">
          <TabsTrigger
            value="slow-subscription"
            className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3"
          >
            <Clock className="h-4 w-4" />
            <span className="font-medium">Slow Subscription</span>
          </TabsTrigger>
          <TabsTrigger
            value="connection-jitter"
            className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3"
          >
            <Activity className="h-4 w-4" />
            <span className="font-medium">Connection Jitter</span>
          </TabsTrigger>
          <TabsTrigger
            value="system-alarm"
            className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">System Alarm</span>
          </TabsTrigger>
          <TabsTrigger
            value="ban-log"
            className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3"
          >
            <FileX className="h-4 w-4" />
            <span className="font-medium">Ban Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slow-subscription" className="mt-0">
          <SlowSubscriptionList />
        </TabsContent>
        <TabsContent value="connection-jitter" className="mt-0">
          <ConnectionJitterList />
        </TabsContent>
        <TabsContent value="system-alarm" className="mt-0">
          <SystemAlarmList />
        </TabsContent>
        <TabsContent value="ban-log" className="mt-0">
          <BanLogList />
        </TabsContent>
      </Tabs>
    </CommonLayout>
  );
}
