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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCompanyStore } from "@/stores";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

const FormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  documents: z.array(z.any()),
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      documents: [],
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-h-[60rem]">
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={onSubmit}
          >
            <DialogHeader>
              <DialogTitle>Nova competência</DialogTitle>
              <DialogDescription>
                Adicione as informações da nova competência aqui.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-7 min-w-[16rem]">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-title">Título</FormLabel>
                      <FormControl>
                        <Input
                          id="register-title"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-description">
                        Descrição
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="register-description"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Documentos anexados:</span>
                    <div className="flex flex-col gap-1">
                      {form
                        .getValues("documents")
                        .map((file, index) => (
                          <div
                            key={file}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm">{file.title}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                const updatedFiles =
                                  form.getValues("documents").filter(
                                    (_, i) => i !== index,
                                  );
                                form.setValue("documents", updatedFiles);
                              }}
                            >

                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Criar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}