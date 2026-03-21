import { createFileRoute } from '@tanstack/react-router';
import SystemLog from '@/features/system/system-log';

export const Route = createFileRoute('/_authenticated/system/system-log')({
  component: SystemLog,
});
