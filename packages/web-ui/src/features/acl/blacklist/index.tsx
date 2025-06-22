import { CommonLayout } from '@/components/layout/common-layout';
import BlackList from './list';

export default function BlacklistManagement() {
  return (
    <CommonLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blacklist Management</h2>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <BlackList />
      </div>
    </CommonLayout>
  );
}
