import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/advanced/topic-rewrite/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/advanced/topic-rewrite/"!</div>;
}
