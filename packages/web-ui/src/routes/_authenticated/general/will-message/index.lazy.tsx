import { createLazyFileRoute } from '@tanstack/react-router';
import WillMessage from '@/features/general/will-message';

export const Route = createLazyFileRoute('/_authenticated/general/will-message/')({
  component: WillMessage,
});
