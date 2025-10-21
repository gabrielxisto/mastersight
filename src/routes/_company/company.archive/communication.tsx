import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_company/company/archive/communication")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <div>Hello "/company/_layout/archive/communication"!</div>;
}
