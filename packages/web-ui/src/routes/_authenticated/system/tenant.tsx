import { createFileRoute } from '@tanstack/react-router';
import TenantManagement from '@/features/system/tenant';

export const Route = createFileRoute('/_authenticated/system/tenant')({
  component: TenantManagement,
});
