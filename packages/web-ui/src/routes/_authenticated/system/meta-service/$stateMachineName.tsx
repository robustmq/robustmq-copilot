import { createFileRoute } from '@tanstack/react-router';
import MetaServiceDetail from '@/features/system/meta-service/detail';

export const Route = createFileRoute('/_authenticated/system/meta-service/$stateMachineName')({
  component: MetaServiceDetail,
});
