import { createLazyFileRoute } from '@tanstack/react-router';
import Overview from '@/features/general/overview';

export const Route = createLazyFileRoute('/_authenticated/overview')({
  component: Overview,
});
