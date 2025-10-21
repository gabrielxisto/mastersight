import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCompanyStore, useCompaniesStore } from "@/stores/";
import { ContentSection } from "@/components/company/content-section";
import { formatCnpj } from "@/lib/formatter";
import api from "@/services/api.service";
import toast from "react-hot-toast";
import { messages } from "@/lib/texts";

export const Route = createFileRoute("/_company/company/_settings/settings/")({
  component: SettingsComponent,
});

const companyFormSchema = z.object({
  name: z
    .string()
    .min(1, "Por favor insira o nome da empresa.")
    .min(2, "O nome deve ter pelo menos mais de 2 caracteres.")
    .max(30, "O nome não deve ter mais de 30 caracteres."),
  cnpj: z.string().min(17, "O CNPJ deve ter 17 caracteres."),
  address: z.string("Por favor insira o endereço."),
  domain: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

function SettingsComponent() {
  const companies = useCompaniesStore();
  const company = useCompanyStore();

  const defaultValues = useMemo(
    () => ({
      name: company.current?.name,
      cnpj: company.current?.cnpj,
      address: company.current?.address,
      domain: company.current?.domain || "",
    }),
    [company.current],
  );

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  function handleSubmit(data: CompanyFormValues) {
    api
      .post("/companies/update", {
        id: company.current?.id,
        ...data,
      })
      .then((response) => {
        defaultValues.name = response.data.company.name;
        defaultValues.cnpj = response.data.company.cnpj;
        defaultValues.address = response.data.company.address;

        company.set(response.data.company);

        toast.success(messages.success["company-infos-updated"]);

        api.get("/users/companies").then((response) => {
          companies.set(response.data.companies);
        });
      });
  }

  const watched = form.watch();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    setIsDisabled(
      watched.name === defaultValues.name &&
        watched.cnpj === defaultValues.cnpj &&
        watched.address === defaultValues.address,
    );
  }, [watched, defaultValues]);

  return (
    <ContentSection
      title="Informações"
      desc="Gerencie as informações da sua empresa."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa" {...field} />
                </FormControl>
                <FormDescription>
                  Este nome será exibido para todos que possuirem algum contato
                  com a empresa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CNPJ da empresa"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatCnpj(e.target.value);
                      field.onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Este CNPJ será exibido para todos que possuirem algum contato
                  com a empresa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço da empresa" {...field} />
                </FormControl>
                <FormDescription>
                  Esta informação não irá impactar no funcionamento ou
                  visualização da sua empresa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domínio</FormLabel>
                <FormControl>
                  <Input 
                    disabled 
                    placeholder="Domínio da empresa" 
                    className="disabled:opacity-100" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  O domínio irá possibilitar você adicionar membros a sua empresa sem que eles precisem aceitar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className={isDisabled ? "opacity-80 cursor-default" : ""}
            type="submit"
            disabled={isDisabled}
          >
            Salvar
          </Button>
        </form>
      </Form>
    </ContentSection>
  );
}
