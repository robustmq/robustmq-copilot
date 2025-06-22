import { createLazyFileRoute } from '@tanstack/react-router';
import Topic from '@/features/general/topic';

export const Route = createLazyFileRoute('/_authenticated/general/topic/')({
  component: Topic,
});
