import { createLazyFileRoute } from '@tanstack/react-router';
import BlacklistManagement from '@/features/acl/blacklist';

export const Route = createLazyFileRoute('/_authenticated/acl/blacklist-management/')({
  component: BlacklistManagement,
});
