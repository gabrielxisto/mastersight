import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/docs")({
  component: DocsComponent,
});

function DocsComponent() {
  return <div>Hello "/dashboard/_layout/docs"!</div>;
}
