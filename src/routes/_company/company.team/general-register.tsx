import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_company/company/team/general-register')({
  component: GeneralRegisterComponent,
})

function GeneralRegisterComponent() {
  return <div>Hello "/company/_layout/team/general-register"!</div>
}
