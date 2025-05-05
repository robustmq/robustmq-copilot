import { createLazyFileRoute } from '@tanstack/react-router';
import Client from '@/features/general/client';

export const Route = createLazyFileRoute('/_authenticated/general/client/')({
  component: Client,
});
