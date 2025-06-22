import { createLazyFileRoute } from '@tanstack/react-router';
import SlowSubscription from '@/features/advanced/slow-subscription';

export const Route = createLazyFileRoute('/_authenticated/advanced/slow-subscription/')({
  component: SlowSubscription,
});
