import Topic from '@/features/monitoring/topic';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/monitoring/topic/')({
  component: Topic,
});
