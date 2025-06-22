import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/data-integration/schema/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/data-integration/schema/"!</div>
}
