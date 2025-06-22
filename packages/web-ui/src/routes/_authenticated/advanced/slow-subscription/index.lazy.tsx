import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/advanced/slow-subscription/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/advanced/slow-subscription/"!</div>;
}
