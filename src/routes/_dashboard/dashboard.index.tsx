import { useEffect } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useCompaniesStore, useCompanyStore } from '@/stores/';
import api from '@/services/api.service';

export const Route = createFileRoute('/_dashboard/dashboard/')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const router = useRouter();
  const company = useCompanyStore();
  const companies = useCompaniesStore();

  useEffect(() => {
    api.get("/users/companies").then((response) => {
      companies.set(response.data.companies);
    })
  }, [])

  const openCompany = (id: number) => {
    api.get(`/companies?id=${id}`).then((response) => {
      company.set(response.data.company)
      router.navigate({ to: "/company" })
      api.post("/users/companies/last-access", { companyId: id })
    })
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {companies.current.map((company) => (
        <Card 
          key={company.id}
          className="@container/card"
        >
          <CardHeader>
            <div className='flex justify-between w-full items-center'>
              <CardDescription>Empresa</CardDescription>
              <CardAction>
                <Badge variant="outline">
                  {company.cnpj}
                </Badge>
              </CardAction>
            </div>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {company.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Ultimo acesso há {company.lastAccess
                ? (
                  Math.floor((Date.now() - company.lastAccess) / 1000 / 60 / 60) < 1
                    ? "agora a pouco"
                    : `${Math.floor((Date.now() - company.lastAccess) / 1000 / 60 / 60)} horas`
                )
                : "N/A"}
            </div>
          </CardHeader>
          <CardFooter className="flex w-full items-start gap-1.5 text-sm">
            <Button 
              onClick={() => openCompany(company.id)}
              className='hover:opacity-90'
            >
              Acessar
            </Button>
            {company.permissions.administrator && 
              <Button variant="outline" className="hover:opacity-90">
                <Settings />
              </Button>
            }
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
