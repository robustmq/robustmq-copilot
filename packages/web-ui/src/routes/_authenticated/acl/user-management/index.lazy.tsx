import { createLazyFileRoute } from '@tanstack/react-router';
import UserManagement from '@/features/acl/user';

export const Route = createLazyFileRoute('/_authenticated/acl/user-management/')({
  component: UserManagement,
});
