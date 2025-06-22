import Connector from '@/features/data-integration/connector';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/data-integration/connector/')({
  component: Connector,
});
