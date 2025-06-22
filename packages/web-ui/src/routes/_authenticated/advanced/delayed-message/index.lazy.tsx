import { createLazyFileRoute } from '@tanstack/react-router';
import DelayedMessage from '@/features/advanced/delayed-message';

export const Route = createLazyFileRoute('/_authenticated/advanced/delayed-message/')({
  component: DelayedMessage,
});
