import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function({ 
    open, 
    onOpenChange, 
    data,
    onSubmit 
}: { 
    open: boolean, 
    onOpenChange: (open: boolean) => void, 
    data: any,
    onSubmit: (data: React.FormEvent<HTMLFormElement>) => void 
}) {
    return ( 
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[26.56rem]">
              <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                <DialogHeader>
                  <DialogTitle>Editar departamento</DialogTitle>
                  <DialogDescription>
                    Edite as informações do departamento aqui.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="department-name">Nome</Label>
                    <Input defaultValue={data ? data.name : ""} id="department-name" name="name" required />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="department-description">Descrição</Label>
                    <Input defaultValue={data ? data.description : ""} id="department-description" name="description" required />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="department-salary">Média salarial</Label>
                    <Input 
                      defaultValue={data?.salary ? (`R$ ${data.salary.toLocaleString("pt-BR")}`) : "R$ 0,00"}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length === 0) value = "0";
                        value = value.padStart(3, "0");
                        const intValue = parseInt(value, 10);
                        const formatted = (intValue / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                        e.target.value = formatted;
                      }} 
                      id="department-salary" 
                      name="salary"
                    />
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