import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail } from "lucide-react";
import { useCompanyStore, useUserStore } from "@/stores";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function TeamHeader({
  data,
  openDelete,
  openEdit
}: {
  data: any;
  openDelete: () => void;
  openEdit: () => void;
}) {
  const user = useUserStore();
  const company = useCompanyStore();
  const roleData = company.current
    ? company.current.roles.find((role) => role.id === data.role)
    : { name: "Sem cargo", departmentId: 1 };
  const departmentData = company.current
    ? company.current.departments.find(
        (dept) => dept.id === roleData?.departmentId,
      )
    : { name: "Sem departamento" };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`${import.meta.env.VITE_CDN_ENDPOINT}/images/users/${data.image}`}
                alt="Profile"
              />
              <AvatarFallback className="text-2xl">{getInitials(data.name)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{data.name}</h1>
                {data.admin && <p 
                  style={{ 
                    backgroundColor: `${company.current?.color}26` || "#4F46E5",
                    borderColor: company.current?.color || "#4F46E5",
                    color: company.current?.color || "#000000",
                  }}
                  className="px-2 py-0.5 rounded-md border border-1 text-xs"
                >
                  SMA
                </p>}
              </div>
              <p className="text-muted-foreground">
                {roleData?.name && <>{roleData?.name} | </>} Dep.{" "}
                {departmentData?.name}
              </p>
            </div>
            <div className="text-muted-foreground flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {data.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Entrou em{" "}{format(new Date(data.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 ml-auto">
            <Button 
              onClick={openEdit}
              variant="default"
            >
              Editar Usuário
            </Button>
            {data.email !== user.current?.email && (
              <Button
                onClick={openDelete}
                variant="destructive"
              >
                Deletar Usuário
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
