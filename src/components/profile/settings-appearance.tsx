import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Image, Pencil } from "lucide-react";
import api from "@/services/api.service";
import clsx from "clsx";

import type { UserFormValues } from "./settings";

export default function ({
  data,
  set,
}: {
  data: UserFormValues;
  set: (data: UserFormValues) => void;
}) {
  const [showEditImage, setShowEditImage] = useState(false);
  const form = useForm<UserFormValues>({
    defaultValues: data,
  });

  const saveImage = (file: File | null) => {
    const formData = new FormData();
    formData.append("file", file as any);

    api
      .post("/users/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        form.setValue("image", response.data.hash);
        set({ ...data, image: response.data.hash });
      });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col justify-between space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    className="absolute size-30 z-100 opacity-0 cursor-pointer"
                    onMouseEnter={() => setShowEditImage(true)}
                    onMouseLeave={() => setShowEditImage(false)}
                    onChange={(e) => saveImage(e.target.files?.[0] || null)}
                  />
                  <div
                    className={clsx(
                      "grid place-items-center relative size-30 bg-sidebar",
                      "rounded-lg border border-input p-1",
                    )}
                  >
                    <div
                      className={clsx(
                        "grid place-items-center absolute z-20 left-0 top-0 transition-all duration-300",
                        "rounded-lg size-full bg-black/30 opacity-0",
                        showEditImage && "opacity-100",
                      )}
                    >
                      <Pencil color="#FFFFFF" />
                    </div>
                    <Image className="text-muted-foreground" />
                    <img
                      key={data.image}
                      src={`${import.meta.env.VITE_CDN_ENDPOINT}/images/users/${data.image}`}
                      alt="Imagem do usuário"
                      className="absolute size-full object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.opacity = "0";
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Esta imagem será exibida para todos que possuirem algum contato
                com a empresa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={() => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <textarea
                  data-slot="input"
                  className={clsx(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "h-[4.5rem]",
                  )}
                  placeholder="Sua descrição"
                  value={data.description}
                  onChange={(e) =>
                    set({ ...data, description: e.target.value })
                  }
                />
              </FormControl>
              <FormDescription>
                Adicione uma descrição, outros usuários poderão visualiza-la.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
