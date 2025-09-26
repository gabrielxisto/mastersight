import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/invites')({
  component: InviteComponent,
})

function InviteComponent() {
  return <div>Hello "/dashboard/_layout/invite"!</div>
}
