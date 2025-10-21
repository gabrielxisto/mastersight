import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanyStore } from "@/stores";
import api from "@/services/api.service";

export default function ({
  open,
  onOpenChange,
  data,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSubmit: (
    data: React.FormEvent<HTMLFormElement>,
    selectedDepartment: string,
  ) => void;
}) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    data?.departmentId ? String(data.departmentId) : "",
  );
  const [departments, setDepartments] = useState([]);
  const company = useCompanyStore();

  useEffect(() => {
    if (company.current?.id) {
      api
        .get(`/companies/departments?companyId=${company.current?.id}`)
        .then((response) => {
          setDepartments(response.data.departments);
        });
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[26.56rem]">
        <form
          className="flex flex-col gap-6"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
            onSubmit(event, selectedDepartment)
          }
        >
          <DialogHeader>
            <DialogTitle>Editar cargo</DialogTitle>
            <DialogDescription>
              Edite as informações do cargo aqui.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="role-name">Nome</Label>
              <Input
                defaultValue={data ? data.name : ""}
                id="role-name"
                name="name"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role-salary">Salário</Label>
              <Input
                defaultValue={
                  data?.salary
                    ? `R$ ${data.salary.toLocaleString("pt-BR")}`
                    : "R$ 0,00"
                }
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (value.length === 0) value = "0";
                  value = value.padStart(3, "0");
                  const intValue = parseInt(value, 10);
                  const formatted = (intValue / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  });
                  e.target.value = formatted;
                }}
                id="roles-salary"
                name="salary"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="roles-department">Departamento</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedDepartment} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(
                    (department: { id: number; name: string }) => (
                      <SelectItem
                        key={department.id}
                        value={String(department.id)}
                        onClick={() =>
                          setSelectedDepartment(String(department.id))
                        }
                      >
                        {department.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
