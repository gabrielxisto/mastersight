import { useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCompaniesStore, useCompanyStore } from "@/stores/";
import api from "@/services/api.service";

export const Route = createFileRoute("/_dashboard/dashboard/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const router = useRouter();
  const company = useCompanyStore();
  const companies = useCompaniesStore();

  useEffect(() => {
    api.get("/users/companies").then((response) => {
      companies.set(response.data.companies);
    });
  }, []);

  const openCompany = (id: number) => {
    api.get(`/companies?id=${id}`).then((response) => {
      company.set(response.data.company);
      router.navigate({ to: "/company" });
      api.post("/users/companies/last-access", { companyId: id });
    });
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {companies.current.length === 0 ? (
        <p className="absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 text-white/40">Nenhuma empresa encontrada</p>
      ) : (
        <>
          {(companies.current.map((company) => {
            let lastAccess = "Nunca acessado";

            if (company.lastAccess) {
              const time = Math.floor(
                (Date.now() - company.lastAccess) / 1000 / 60 / 60,
              );

              if (time < 1) {
                lastAccess = "Acessado agora a pouco";
              } else {
                if (time > 48) {
                  lastAccess = `Acessado há ${Math.floor(time / 24)} dias`;
                } else if (time > 24) {
                  lastAccess = "Acessado há 1 dia";
                } else {
                  lastAccess = `Acessado há ${time} horas`;
                }
              }
            }

            return (
              <Card key={company.id} className="@container/card">
                <CardHeader>
                  <div className="flex justify-between w-full items-center">
                    <CardDescription>Empresa</CardDescription>
                    <CardAction>
                      <Badge variant="outline">{company.cnpj}</Badge>
                    </CardAction>
                  </div>

                  <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {company.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">{lastAccess}</div>
                </CardHeader>
                <CardFooter className="flex w-full items-start gap-1.5 text-sm">
                  <Button
                    onClick={() => openCompany(company.id)}
                    className="hover:opacity-90"
                  >
                    Acessar
                  </Button>
                  {company.permissions.administrator && (
                    <Button variant="outline" className="hover:opacity-90">
                      <Settings />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          }))}
        </>
      )}
    </div>
  );
}
