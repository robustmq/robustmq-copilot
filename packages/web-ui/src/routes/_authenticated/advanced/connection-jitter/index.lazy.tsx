import { createLazyFileRoute } from '@tanstack/react-router';
import ConnectionJitter from '@/features/advanced/connection-jitter';

export const Route = createLazyFileRoute('/_authenticated/advanced/connection-jitter/')({
  component: ConnectionJitter,
});
