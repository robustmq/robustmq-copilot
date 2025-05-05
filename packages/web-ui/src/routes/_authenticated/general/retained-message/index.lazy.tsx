import { createLazyFileRoute } from '@tanstack/react-router';
import RetainedMessage from '@/features/general/retained-message';

export const Route = createLazyFileRoute('/_authenticated/general/retained-message/')({
  component: RetainedMessage,
});
