import Cluster from '@/features/monitoring/cluster';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/monitoring/cluster/')({
  component: Cluster,
});
