import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CommonLayout } from '@/components/layout/common-layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users } from 'lucide-react';
import UserList from './list';
import { CreateUserForm } from './components/create-user-form';
import { getTenantList } from '@/services/mqtt';

export default function UserManagement() {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<string>('all');
  const [appliedTenant, setAppliedTenant] = useState<string>('all');

  const { data: tenantData } = useQuery({
    queryKey: ['TenantListForUserFilter'],
    queryFn: () => getTenantList({ pagination: { offset: 0, limit: 200 } }),
  });

  const tenants = tenantData?.tenantList ?? [];

  const leftActions = (
    <Select value={selectedTenant} onValueChange={setSelectedTenant}>
      <SelectTrigger className="w-[160px] h-8 text-sm">
        <SelectValue placeholder="All Tenants" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Tenants</SelectItem>
        {tenants.map((t) => (
          <SelectItem key={t.tenant_name} value={t.tenant_name}>
            {t.tenant_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const extraActions = (
    <Button
      onClick={() => setCreateUserOpen(true)}
      size="sm"
      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create User
    </Button>
  );

  return (
    <CommonLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <Users className="h-3 w-3 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-purple-600">User Management</h2>
          </div>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <UserList
          extraActions={extraActions}
          leftActions={leftActions}
          tenant={appliedTenant === 'all' ? undefined : appliedTenant}
          onSearch={() => setAppliedTenant(selectedTenant)}
        />
      </div>

      <CreateUserForm open={createUserOpen} onOpenChange={setCreateUserOpen} />
    </CommonLayout>
  );
}
