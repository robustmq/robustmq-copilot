import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CommonLayout } from '@/components/layout/common-layout';
import BlackList from './list';
import { ShieldX, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateBlacklistForm } from './components/create-blacklist-form';
import { getTenantList } from '@/services/mqtt';

export default function BlacklistManagement() {
  const [createBlacklistOpen, setCreateBlacklistOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [appliedTenant, setAppliedTenant] = useState<string>('all');

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForBlacklistFilter'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });
  const tenants = tenantData?.tenantList ?? [];

  const leftActions = useMemo(() => (
    <Select value={selectedTenant} onValueChange={setSelectedTenant}>
      <SelectTrigger className="w-[160px] h-8 text-sm">
        <SelectValue placeholder="All Tenants" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tenants</SelectItem>
        {tenants.map(t => (
          <SelectItem key={t.tenant_name} value={t.tenant_name}>
            {t.tenant_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ), [selectedTenant, tenants]);

  const extraActions = (
    <Button
      onClick={() => setCreateBlacklistOpen(true)}
      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
      size="sm"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Blacklist Rule
    </Button>
  );

  return (
    <CommonLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <ShieldX className="h-3 w-3 text-white" />
          </div>
          <h2 className="text-lg font-bold text-purple-600">Blacklist Management</h2>
        </div>
      </div>
      <BlackList
        leftActions={leftActions}
        extraActions={extraActions}
        tenant={appliedTenant === 'all' ? undefined : appliedTenant}
        onSearch={() => setAppliedTenant(selectedTenant)}
      />
      <CreateBlacklistForm open={createBlacklistOpen} onOpenChange={setCreateBlacklistOpen} />
    </CommonLayout>
  );
}
