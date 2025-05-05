import { createLazyFileRoute } from '@tanstack/react-router';
import Session from '@/features/general/session';

export const Route = createLazyFileRoute('/_authenticated/general/session/')({
  component: Session,
});
