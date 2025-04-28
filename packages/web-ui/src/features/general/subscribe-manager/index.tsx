import { CommonLayout } from '@/components/layout/common-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopicList from './topic';
import SessionList from './session';

export default function SubscribeManager() {
  return (
    <CommonLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SubscribeManager</h2>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <Tabs orientation="vertical" defaultValue="session" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="topic">Topic</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="topic" className="space-y-4">
            <TopicList />
          </TabsContent>
          <TabsContent value="session" className="space-y-4">
            <SessionList />
          </TabsContent>
        </Tabs>
      </div>
    </CommonLayout>
  );
}
