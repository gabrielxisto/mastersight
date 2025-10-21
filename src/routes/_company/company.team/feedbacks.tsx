import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_company/company/team/feedbacks")({
  component: FeedbacksComponent,
});

function FeedbacksComponent() {
  return <div>Hello "/company/_layout/team/feedbacks"!</div>;
}
