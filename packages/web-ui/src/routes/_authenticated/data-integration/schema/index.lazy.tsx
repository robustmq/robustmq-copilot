import Schema from '@/features/data-integration/schema';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/data-integration/schema/')({
  component: Schema,
});
