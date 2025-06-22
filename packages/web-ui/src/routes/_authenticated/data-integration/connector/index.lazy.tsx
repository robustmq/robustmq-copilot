import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/data-integration/connector/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/data-integration/connector/"!</div>
}
