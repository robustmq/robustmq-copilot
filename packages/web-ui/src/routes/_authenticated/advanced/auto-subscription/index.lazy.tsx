import { createLazyFileRoute } from '@tanstack/react-router';
import AutoSubscription from '@/features/advanced/auto-subscription';

export const Route = createLazyFileRoute('/_authenticated/advanced/auto-subscription/')({
  component: AutoSubscription,
});
