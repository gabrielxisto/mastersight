import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/dashboard/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  return <div>Hello "/dashboard/_layout/settings"!</div>
}
