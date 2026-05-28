import { createLazyFileRoute } from '@tanstack/react-router';
import MetaService from '@/features/system/meta-service';

export const Route = createLazyFileRoute('/_authenticated/system/meta-service/')({
  component: MetaService,
});
