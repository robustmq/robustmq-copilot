import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Building2, FileText, Zap, Wifi, BookOpen, Users } from 'lucide-react';
import { TenantRaw } from '@/services/mqtt';
import { format } from 'date-fns';

interface DetailTenantButtonProps {
  tenant: TenantRaw;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2 border-b last:border-0">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide w-44 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-900 dark:text-gray-100 text-right">{value}</span>
    </div>
  );
}

export function DetailTenantButton({ tenant }: DetailTenantButtonProps) {
  const [open, setOpen] = useState(false);

  const createTimeDisplay = tenant.create_time
    ? (() => {
        try {
          return format(new Date(tenant.create_time * 1000), 'yyyy-MM-dd HH:mm:ss');
        } catch {
          return '-';
        }
      })()
    : '-';

  const cfg = tenant.config;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-md"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            Tenant Details
          </SheetTitle>
          <SheetDescription>View complete tenant information and resource quotas</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <FileText className="h-4 w-4 text-purple-600" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Tenant Name" value={<span className="font-mono font-medium">{tenant.tenant_name}</span>} />
              <InfoRow label="Description" value={tenant.desc || <span className="text-gray-400">—</span>} />
              <InfoRow label="Create Time" value={createTimeDisplay} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Resource Quotas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow
                label="Max Connections / Node"
                value={
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-3.5 w-3.5 text-blue-500" />
                    {cfg?.max_connections_per_node?.toLocaleString() ?? <span className="text-gray-400">—</span>}
                  </div>
                }
              />
              <InfoRow
                label="Max Connection Rate / s"
                value={
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-yellow-500" />
                    {cfg?.max_create_connection_rate_per_second?.toLocaleString() ?? <span className="text-gray-400">—</span>}
                  </div>
                }
              />
              <InfoRow
                label="Max Topics"
                value={
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-green-500" />
                    {cfg?.max_topics?.toLocaleString() ?? <span className="text-gray-400">—</span>}
                  </div>
                }
              />
              <InfoRow
                label="Max Sessions"
                value={
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-purple-500" />
                    {cfg?.max_sessions?.toLocaleString() ?? <span className="text-gray-400">—</span>}
                  </div>
                }
              />
              <InfoRow
                label="Max Publish Rate / s"
                value={
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-orange-500" />
                    {cfg?.max_publish_rate?.toLocaleString() ?? <span className="text-gray-400">—</span>}
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
