import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/monitoring/topic/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/monitoring/topic/"!</div>
}
