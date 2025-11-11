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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const FormSchema = z.object({
  user: z.string().min(1),
  content: z.string().min(1),
  score: z.string().min(1),
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user: data.user || "",
      content: "",
      score: "0",
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
              <DialogTitle>Novo feedback</DialogTitle>
              <DialogDescription>
                Adicione as informações do novo feedback aqui.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-7 min-w-[16rem]">
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-user">Usuário</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          className="disabled:opacity-100"
                          id="register-user"
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
                          onValueChange={(value) => field.onChange(String(value[0]))}
                          step={1}
                          min={0}
                          max={100}     
                          value={[Number(field.value)]}
                        />
                        {/* <Input
                          id="register-score"
                          required
                          {...field}
                        /> */}
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