import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/advanced/connection-jitter/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/advanced/connection-jitter/"!</div>;
}
