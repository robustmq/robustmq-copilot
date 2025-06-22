import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/acl/acl-management/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/acl/acl-management/"!</div>;
}
