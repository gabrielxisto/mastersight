import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  return <div>Hello "/admin/dashboard/"!</div>
}
