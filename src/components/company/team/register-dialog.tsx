import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useCompanyStore } from "@/stores";

import {
  permissions,
  defaultPermissions,
  permissionsTypes,
} from "@/lib/permissions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api.service";
import { Switch } from "@/components/ui/switch";

const FormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  department: z.string(),
  role: z.string(),
  salary: z.string(),
  type: z.enum(["employee", "manager"]),
  notify: z.string(),
  permissions: z.array(z.string())
});

export default function ({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: React.FormEvent<HTMLFormElement>,
  ) => void;
}) {
  const company = useCompanyStore();

  const [departments, setDepartments] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [roles, setRoles] = useState<{
    [key: number]: { id: number; name: string }[];
  }>({});

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      name: "",
      department: "",
      role: "",
      salary: "R$ 0,00",
      type: "employee",
      notify: "false",
      permissions: defaultPermissions.employee,
    },
  });

  useEffect(() => {
    if (company.current?.id) {
      api
        .get(`/companies/departments?companyId=${company.current?.id}`)
        .then((response) => {
          setDepartments(response.data.departments);
        });

      api
        .get(`/companies/roles?companyId=${company.current?.id}`)
        .then((response) => {
          const rolesMap: { [key: number]: { id: number; name: string }[] } =
            {};
          response.data.roles.map((role) => {
            if (!rolesMap[role.departmentId]) {
              rolesMap[role.departmentId] = [];
            }
            rolesMap[role.departmentId].push(role);
          });
          setRoles(rolesMap);
        });
    }
  }, [company.current?.id]);

  useEffect(() => {
    const permissionsDefault = defaultPermissions[form.getValues("type")];
    form.setValue("permissions", permissionsDefault || []);
  }, [form.watch("type")]);

  useEffect(() => {
    const notify = form.getValues("notify");
  }, [form.watch("notify")]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-h-[60rem]">
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={onSubmit}
          >
            <DialogHeader>
              <DialogTitle>Novo usuário</DialogTitle>
              <DialogDescription>
                Adicione as informações do novo usuário aqui.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-8">
              <div className="flex flex-col gap-7 min-w-[16rem]">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-email">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          id="register-email"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-name">
                        Nome (Aplicado apenas caso não tenha)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="register-name"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-department">Departamento</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          name="department"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                departments.find(
                                  (department) =>
                                    department.id === Number(field.value),
                                )?.name
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(
                              (department: { id: number; name: string }) => (
                                <SelectItem
                                  key={department.id}
                                  value={String(department.id)}
                                >
                                  {department.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-role">Cargo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          name="role"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                roles[Number(form.watch("department"))]?.find(
                                  (role) => role.id === Number(field.value),
                                )?.name
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {roles[Number(form.watch("department"))]?.map(
                              (role: { id: number; name: string }) => (
                                <SelectItem
                                  key={role.id}
                                  value={String(role.id)}
                                >
                                  {role.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-salary">
                        Salário
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="register-salary"
                          required
                          value={field.value}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length === 0) value = "0";
                            value = value.padStart(3, "0");
                            const intValue = parseInt(value, 10);
                            const formatted = (intValue / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                            field.onChange(formatted);
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-type">Tipo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                permissionsTypes.find(
                                  (type) => type.id === field.value,
                                )?.name
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {permissionsTypes.map(
                              (type: { id: string; name: string }) => (
                                <SelectItem
                                  key={type.id}
                                  value={type.id}
                                >
                                  {type.name}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />           
              </div>

              <div className="grid grid-rows-2 grid-flow-col gap-x-7 items-start">
                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <>
                      {Object.entries(permissions).map(([key, section]) => (
                        <FormItem key={key}>
                          <FormLabel className="text-sm font-bold mb-2">
                            {section.name}
                          </FormLabel>
                          <div className="flex flex-col gap-2 mb-4">
                            {section.list.map((item) => (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center gap-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    name="permissions"
                                    value={item.id}
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {                                      
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </div>
                        </FormItem>
                      ))}
                      <FormMessage />
                    </>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex w-full justify-between sm:justify-between">
              <FormField
                control={form.control}
                name="notify"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="register-notify">Notificar Usuário</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === "true"}
                        onCheckedChange={(value) => field.onChange(value ? "true" : "false")}
                        {...field}
                      >
                        
                      </Switch>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />   

              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Criar</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}