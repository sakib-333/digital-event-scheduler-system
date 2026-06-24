import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/event/$eventId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { eventId } = Route.useParams()

  console.log('eventId', eventId)

  return <div>Hello "/_authenticated/event/{eventId}"!</div>
}
