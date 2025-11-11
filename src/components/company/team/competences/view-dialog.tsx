import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { useEffect, useRef } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import { cn } from "@/lib/utils";
import { useState } from "react";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

const FormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  documents: z.array(z.any()),
});

export default function ({
  open,
  onOpenChange,
  data,
  onSubmit
}: {
  open: boolean;
  onOpenChange: (open: boolean | string) => void;
  data: {
    title?: string;
    description?: string;
    documents?: string[];
  } | null;
  onSubmit: (
    data: React.FormEvent<HTMLFormElement>,
  ) => void;
}) {
  const [documentViewOpen, setDocumentViewOpen] = useState<boolean>(false);
  const [documentData, setDocumentData] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: data?.title,
      description: data?.description,
      documents: data?.documents || [],
    },
  });

  const PdfThumbnail = ({
    url,
    className,
    maxWidth = 60,
    maxHeight = 60,
  }: {
    url: string;
    className?: string;
    maxWidth?: number;
    maxHeight?: number;
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
      let isCancelled = false;

      GlobalWorkerOptions.workerSrc = workerUrl;

      const render = async () => {
        try {
          const loadingTask = getDocument({ url });
          const pdf = await loadingTask.promise;
          if (isCancelled) return;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1 });

          const scaleToFit = Math.min(
            maxWidth / viewport.width,
            maxHeight / viewport.height,
          );
          const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR to avoid huge canvases
          const scaledViewport = page.getViewport({ scale: scaleToFit * dpr });

          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = Math.ceil(scaledViewport.width);
          canvas.height = Math.ceil(scaledViewport.height);
          canvas.style.width = `${Math.round(scaledViewport.width / dpr)}px`;
          canvas.style.height = `${Math.round(scaledViewport.height / dpr)}px`;

          await page.render({
            canvasContext: ctx,
            viewport: scaledViewport,
            canvas,
          }).promise;
        } catch(err) {
          console.log("Error rendering PDF thumbnail:", err);
        }
      };

      render();
      return () => {
        isCancelled = true;
      };
    }, [url, maxWidth, maxHeight]);

    return <canvas ref={canvasRef} className={className} />;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-auto max-h-[60rem]">
          <Form {...form}>
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>Competência</DialogTitle>
                <DialogDescription>
                  Visualize ou edite as informações da competência aqui.
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
                    <span className="text-sm font-medium">
                      Documentos anexados:
                    </span>
                    <div className="grid grid-cols-5 gap-x-2">
                      {Array.from({
                        length:
                          form.getValues("documents").length < 5
                            ? 5
                            : form.getValues("documents").length,
                      }).map((_, index) => {
                        const file = form.getValues("documents")[index];

                        return (
                          <button
                            key={file || `slot-${index}`}
                            type="button"
                            onClick={() => {
                              if (file) {
                                setDocumentViewOpen(true);
                                setDocumentData(file);
                              } else {
                                const input = document.getElementById(
                                  `doc-file-${index}`,
                                ) as HTMLInputElement | null;
                                input?.click();
                              }
                            }}
                            className={cn(
                              "relative flex items-center justify-center size-15 border rounded-md cursor-pointer overflow-hidden",
                              !file && "bg-muted",
                            )}
                          >
                            <input
                              id={`doc-file-${index}`}
                              type="file"
                              accept=".pdf,image/*"
                              className="hidden"
                            />
                            {file &&
                              (file.includes(".pdf") ? (
                                <PdfThumbnail
                                  url={`${import.meta.env.VITE_CDN_ENDPOINT}/docs/competences/${file}`}
                                  className="size-full object-cover rounded-md"
                                  maxWidth={60}
                                  maxHeight={60}
                                />
                              ) : (
                                <img
                                  src={`${import.meta.env.VITE_CDN_ENDPOINT}/docs/competences/${file}`}
                                  alt={file}
                                  className="size-full object-cover rounded-md"
                                />
                              ))}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="default">
                  Salvar
                </Button>
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
      <Dialog open={documentViewOpen} onOpenChange={setDocumentViewOpen}>
        <DialogContent className="max-w-[30rem] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Visualizar Documento</DialogTitle>
            <DialogDescription>{documentData}</DialogDescription>
          </DialogHeader>

          {documentData ? (
            documentData.includes(".pdf") ? (
              <Worker workerUrl={workerUrl}>
                <Viewer
                  fileUrl={`${import.meta.env.VITE_CDN_ENDPOINT}/docs/competences/${documentData}`}
                />
              </Worker>
            ) : (
              <img
                src={`${import.meta.env.VITE_CDN_ENDPOINT}/docs/competences/${documentData}`}
                alt={documentData}
                className="size-full object-cover rounded-md"
              />
            )
          ) : (
            <p className="text-muted-foreground">
              Nenhum documento selecionado.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
