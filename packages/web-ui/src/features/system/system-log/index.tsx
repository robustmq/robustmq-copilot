import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CommonLayout } from '@/components/layout/common-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollText, Clock, Activity, AlertTriangle, FileX } from 'lucide-react';
import SlowSubscriptionList from '@/features/advanced/slow-subscription/list';
import ConnectionJitterList from '@/features/advanced/connection-jitter/list';
import SystemAlarmList from '@/features/advanced/system-alarm/list';
import BanLogList from '@/features/system/ban-log/list';
import { getTenantList } from '@/services/mqtt';

function TenantSelect({ value, onChange, tenants }: { value: string; onChange: (v: string) => void; tenants: { tenant_name: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] h-8 text-sm">
        <SelectValue placeholder="All Tenants" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tenants</SelectItem>
        {tenants.map(t => (
          <SelectItem key={t.tenant_name} value={t.tenant_name}>{t.tenant_name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function SystemLog() {
  const [slowTenant, setSlowTenant] = useState<string>('all');
  const [appliedSlowTenant, setAppliedSlowTenant] = useState<string>('all');
  const [jitterTenant, setJitterTenant] = useState<string>('all');
  const [appliedJitterTenant, setAppliedJitterTenant] = useState<string>('all');
  const [banTenant, setBanTenant] = useState<string>('all');
  const [appliedBanTenant, setAppliedBanTenant] = useState<string>('all');

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForSystemLog'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const slowSubLeftActions = useMemo(() => (
    <TenantSelect value={slowTenant} onChange={setSlowTenant} tenants={tenants} />
  ), [slowTenant, tenants]);

  const jitterLeftActions = useMemo(() => (
    <TenantSelect value={jitterTenant} onChange={setJitterTenant} tenants={tenants} />
  ), [jitterTenant, tenants]);

  const banLogLeftActions = useMemo(() => (
    <TenantSelect value={banTenant} onChange={setBanTenant} tenants={tenants} />
  ), [banTenant, tenants]);

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
            value="ban-log"
            className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3"
          >
            <FileX className="h-4 w-4" />
            <span className="font-medium">Ban Log</span>
          </TabsTrigger>
          <TabsTrigger
            value="system-alarm"
            className="flex items-center space-x-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm py-3"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">System Alarm</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slow-subscription" className="mt-0">
          <SlowSubscriptionList
            leftActions={slowSubLeftActions}
            tenant={appliedSlowTenant === 'all' ? undefined : appliedSlowTenant}
            onSearch={() => setAppliedSlowTenant(slowTenant)}
          />
        </TabsContent>
        <TabsContent value="connection-jitter" className="mt-0">
          <ConnectionJitterList
            leftActions={jitterLeftActions}
            tenant={appliedJitterTenant === 'all' ? undefined : appliedJitterTenant}
            onSearch={() => setAppliedJitterTenant(jitterTenant)}
          />
        </TabsContent>
        <TabsContent value="ban-log" className="mt-0">
          <BanLogList
            leftActions={banLogLeftActions}
            tenant={appliedBanTenant === 'all' ? undefined : appliedBanTenant}
            onSearch={() => setAppliedBanTenant(banTenant)}
          />
        </TabsContent>
        <TabsContent value="system-alarm" className="mt-0">
          <SystemAlarmList />
        </TabsContent>
      </Tabs>
    </CommonLayout>
  );
}
