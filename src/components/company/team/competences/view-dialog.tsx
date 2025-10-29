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
import { Worker, Viewer } from '@react-pdf-viewer/core';

const FormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  documents: z.array(z.any()),
});

export default function ({
  open,
  onOpenChange,
  data,
}: {
  open: boolean;
  onOpenChange: (open: boolean | string) => void;
  data: any;
}) {
  const company = useCompanyStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: data?.title,
      description: data?.description,
      documents: data?.documents || [],
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-auto max-h-[60rem]">
        <Form {...form}>
          <form className="flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle>Competência</DialogTitle>
              <DialogDescription>
                Visualize as informações da competência aqui.
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
                          disabled
                          className="disabled:opacity-100"
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
                        .map((file) => (
                          <div
                            key={file}
                            className="flex items-center gap-2 size-15 border rounded-md"
                          >
                            {file.includes(".pdf") ? (
                              <Worker workerUrl="/pdf.worker.min.js">
                                <Viewer fileUrl={`${import.meta.env.VITE_CDN_ENDPOINT}/docs/competences/${file}`} />
                              </Worker>
                            ) : (
                              <img 
                                src={`${import.meta.env.VITE_CDN_ENDPOINT}/docs/competences/${file}`}
                                alt={file} 
                                className="size-full object-cover rounded-md"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
              <Button 
                type="button"
                onClick={() => onOpenChange("delete")} 
                variant="destructive"
              >
                Deletar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}