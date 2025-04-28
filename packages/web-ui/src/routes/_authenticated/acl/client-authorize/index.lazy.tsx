import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/acl/client-authorize/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/acl/client-authorize/"!</div>;
}
