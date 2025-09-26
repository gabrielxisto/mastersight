import { createFileRoute } from '@tanstack/react-router'
import ProfileSettings from "@/components/profile/settings";

export const Route = createFileRoute('/_dashboard/dashboard/profile')({
  component: ProfileComponent,
})

function ProfileComponent() {
  return <ProfileSettings />
}
