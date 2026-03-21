import { useState } from 'react';
import { CommonLayout } from '@/components/layout/common-layout';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import TenantList from './list';
import { CreateTenantForm } from './components/create-tenant-form';

export default function TenantManagement() {
  const [createTenantOpen, setCreateTenantOpen] = useState(false);

  const extraActions = (
    <Button
      onClick={() => setCreateTenantOpen(true)}
      size="sm"
      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Tenant
    </Button>
  );

  return (
    <CommonLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
            <Building2 className="h-3 w-3 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-purple-600">Tenant Management</h2>
          </div>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <TenantList extraActions={extraActions} />
      </div>

      <CreateTenantForm open={createTenantOpen} onOpenChange={setCreateTenantOpen} />
    </CommonLayout>
  );
}
