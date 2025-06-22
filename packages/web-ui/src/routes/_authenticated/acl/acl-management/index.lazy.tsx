import { createLazyFileRoute } from '@tanstack/react-router';
import AclManagement from '@/features/acl/acl';

export const Route = createLazyFileRoute('/_authenticated/acl/acl-management/')({
  component: AclManagement,
});
