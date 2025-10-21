import { createFileRoute } from "@tanstack/react-router";
import ProfileSettings from "@/components/profile/settings";

export const Route = createFileRoute("/_company/company/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ProfileSettings />;
}
