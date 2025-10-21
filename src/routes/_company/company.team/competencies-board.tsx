import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_company/company/team/competencies-board",
)({
  component: CompetenciesComponent,
});

function CompetenciesComponent() {
  return <div>Hello "/company/_layout/team/competencies-board"!</div>;
}
