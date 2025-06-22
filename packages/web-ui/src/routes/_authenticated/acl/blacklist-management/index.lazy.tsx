import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/acl/blacklist-management/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/acl/blacklist-management/"!</div>;
}
