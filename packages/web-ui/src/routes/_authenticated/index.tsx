import { createFileRoute } from '@tanstack/react-router';
import Dashboard from '@/features/general/dashboard';

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
});
