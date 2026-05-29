import { createFileRoute } from '@tanstack/react-router';
import ConfigurationDetail from '@/features/system/configuration/detail';

export const Route = createFileRoute('/_authenticated/system/configuration_/$brokerId')({
  component: ConfigurationDetail,
});
