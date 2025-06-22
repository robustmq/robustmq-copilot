import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/general/topic/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/general/topic/"!</div>;
}
