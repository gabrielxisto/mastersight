import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_company/company/team/evaluations')({
  component: EvaluationsComponent,
})

function EvaluationsComponent() {
  return <div>Hello "/company/_layout/team/evaluations"!</div>
}
