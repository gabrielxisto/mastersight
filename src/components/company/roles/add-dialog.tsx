import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/services/api.service";
import { useCompanyStore } from "@/stores";

export default function({ 
    open, 
    onOpenChange, 
    onSubmit 
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    onSubmit: (data: React.FormEvent<HTMLFormElement>, selectedDepartment: string) => void 
}) {
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [departments, setDepartments] = useState([]);
    const company = useCompanyStore();

    useEffect(() => {
      if (company.current?.id) {        
        api.get(`/companies/departments?companyId=${company.current?.id}`).then((response) => {
          setDepartments(response.data.departments);
        });
      }
    }, []);

    useEffect(() => {
      console.log(selectedDepartment);
    }, [selectedDepartment])

    return ( 
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[26.56rem]">
              <form 
                className="flex flex-col gap-6" 
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => onSubmit(event, selectedDepartment)}
              >
                <DialogHeader>
                  <DialogTitle>Novo cargo</DialogTitle>
                  <DialogDescription>
                    Adicione as informações do novo cargo aqui. Após o
                    cadastro, você poderá adicionar usuários a ele.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="roles-name">Nome</Label>
                    <Input id="roles-name" name="name" required />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="roles-salary">Salário</Label>
                    <Input 
                      defaultValue="R$ 0,00"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length === 0) value = "0";
                        value = value.padStart(3, "0");
                        const intValue = parseInt(value, 10);
                        const formatted = (intValue / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
                        <SelectValue placeholder={departments.find(department => department.id === Number(selectedDepartment))?.name} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department: { id: number; name: string }) => (
                          <SelectItem 
                            key={department.id} 
                            value={String(department.id)}
                            onClick={() => setSelectedDepartment(String(department.id))}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
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
    )
}