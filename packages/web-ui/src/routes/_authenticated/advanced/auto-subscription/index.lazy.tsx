import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/advanced/auto-subscription/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/advanced/auto-subscription/"!</div>;
}
