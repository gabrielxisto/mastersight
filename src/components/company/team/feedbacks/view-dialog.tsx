import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useState } from "react";
import api from "@/services/api.service";
import { useCompanyStore } from "@/stores";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  user: z.string().min(1),
  content: z.string().min(1),
  score: z.string().min(1),
});

export default function ({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean | string) => void;
  data: {
    id: number;
    userId: number;
    creatorId: number;
    createdAt: string;
    content: string;
    score: string;
  } | null;
}) {
  const company = useCompanyStore();
  const [users, setUsers] = useState<any>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: "",
      content: data?.content || "",
      score: data?.score || "",
    },
  });

  useEffect(() => {
    if (company.current) {
      api.get(`/companies/team?companyId=${company.current?.id}`).then((response) => {
        setUsers(response.data.team);
        const userData = response.data.team.find((u: any) => u.id === data?.userId);
        form.reset({
          user: userData?.email || "",
          score: data?.score,
          content: data?.content,
        })
      });
    }
  }, [])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-auto max-h-[60rem]">
          <Form {...form}>
            <form className="flex flex-col gap-6">
              <DialogHeader>
                <DialogTitle>Feedback #{data?.id}</DialogTitle>
                <DialogDescription>
                  {users.find((u: any) => u.userId === data?.creatorId)?.name || "Usuário deletado"} | {data ? new Date(data?.createdAt).toLocaleDateString("pt-BR") : ""}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-7 min-w-[16rem]">
                  <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="register-title">Usuário</FormLabel>
                        <FormControl>
                          <Input
                            id="register-user"
                            className="disabled:opacity-100"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="score"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between" htmlFor="register-score">
                          <p>
                            Score
                          </p>
                          <p>
                            {field.value}%
                          </p>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            {...field}                   
                            step={1}
                            min={0}
                            max={100}     
                            value={[Number(field.value)]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="register-content">
                          Descrição
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id="register-content"
                            disabled
                            className="disabled:opacity-100"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
