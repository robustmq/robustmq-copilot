import { createLazyFileRoute } from '@tanstack/react-router';
import PlacementCenter from '@/features/general/placement-center';

export const Route = createLazyFileRoute('/_authenticated/general/placement-center/')({
  component: PlacementCenter,
});
