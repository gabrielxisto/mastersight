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

const FormSchema = z.object({
  department: z.string(),
  role: z.string(),
  salary: z.string(),
  type: z.enum(["employee", "manager"]),
  permissions: z.array(z.string())
});

export default function ({
  open,
  data,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  data: any;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: React.FormEvent<HTMLFormElement>,
  ) => void;
}) {
  if (!data) return null;
  
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
      department: String(data.department),
      role: String(data.role),
      salary: (data.salary || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      type: "employee",
      permissions: data.permissions,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-h-[60rem]">
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={onSubmit}
          >
            <DialogHeader>
              <DialogTitle>Editar usuário</DialogTitle>
              <DialogDescription>
                Adicione as novas informações do usuário aqui.
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-8">
              <div className="flex flex-col gap-7 min-w-[16rem]">
                <FormItem>
                  <FormLabel htmlFor="name">
                    Salário
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      required
                      disabled
                      value={data.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="department">Departamento</FormLabel>
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
                      <FormLabel htmlFor="role">Cargo</FormLabel>
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
                      <FormLabel htmlFor="salary">
                        Salário
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="salary"
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
                      <FormLabel htmlFor="type">Tipo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value: "manager" | "employee") => {
                            const permissionsDefault = defaultPermissions[value];
                            form.setValue("permissions", permissionsDefault || []);

                            field.onChange(value);
                          }}
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

              <div className="grid grid-rows-2 grid-flow-col gap-x-7 items-start auto-rows-min">
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
                            {section.list.map((item) => {
                              return (
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
                              )
                            })}
                          </div>
                        </FormItem>
                      ))}
                      <FormMessage />
                    </>
                  )}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}