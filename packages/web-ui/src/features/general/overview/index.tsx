import { CommonLayout } from '@/components/layout/common-layout';
import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Overview() {
  const { t } = useTranslation('menu');

  return (
    <CommonLayout>
      <div className="mb-4 flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
          <LayoutDashboard className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-purple-600">{t('global_overview')}</h1>
      </div>
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <div className="text-center space-y-2">
          <LayoutDashboard className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Coming soon...</p>
        </div>
      </div>
    </CommonLayout>
  );
}
