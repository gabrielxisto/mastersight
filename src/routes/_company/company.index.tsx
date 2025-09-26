import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_company/company/')({
  component: CompanyComponent,
})

function CompanyComponent() {
  return <div>Hello "/company/"!</div>
}
