import { createLazyFileRoute } from '@tanstack/react-router';
import TopicRewrite from '@/features/advanced/topic-rewrite';

export const Route = createLazyFileRoute('/_authenticated/advanced/topic-rewrite/')({
  component: TopicRewrite,
});
