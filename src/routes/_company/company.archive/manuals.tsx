import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_company/company/archive/manuals")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/company/_layout/archive/manuals"!</div>;
}
