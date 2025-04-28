import { createLazyFileRoute } from '@tanstack/react-router';
import SubscribeManager from '@/features/general/subscribe-manager';

export const Route = createLazyFileRoute('/_authenticated/general/subscribe-manager/')({
  component: SubscribeManager,
});
