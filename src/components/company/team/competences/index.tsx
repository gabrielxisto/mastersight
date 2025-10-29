import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyStore } from "@/stores";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import clsx from "clsx";
import CompetencesDialogs from "./competences-dialogs";

export default function Competences({ data }: { data: any }) {
  const company = useCompanyStore();
  const [dialogOpen, setDialogOpen] = useState<"add" | "view" | "delete" | false>(false);
  const [dialogData, setDialogData] = useState<any>(null);

  return (
    <TabsContent value="competences" className="max-h-[28.4rem] overflow-y-scroll space-y-6">
      <Card className="min-h-[28.4rem] mb-2">
        <CardHeader className="justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Competências</CardTitle>
            <CardDescription>Abaixo está todas as competências listadas do usuário.</CardDescription>
          </div>

          <Button
            onClick={() => {
              setDialogOpen("add");
              setDialogData({
                name: "",
                description: "",
                documents: []
              });
            }}
            variant="default"
          >
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="-mx-3 h-full overflow-y-scroll p-3 scrollbar-hidden">
            {data.competences.map((competence: any) => {    
              return (
                <div
                  key={competence.id}
                  className={clsx(
                    "relative group dark:bg-input/30 border hover:text-accent-foreground",
                    "flex flex-col min-h-20 w-full rounded-md mb-2 text-start text-sm",
                    "transition-all duration-150 cursor-pointer hover:bg-black/2",
                  )}
                >
                  <button 
                    type="button"
                    className="flex items-start absolute w-full h-full left-0 top-0 px-3 py-3 text-start cursor-pointer"
                    onClick={() => {
                      setDialogOpen("view");
                      setDialogData(competence);
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="col-start-2 row-span-2 font-medium">
                        {competence.title}
                      </span>
                      <p className="text-muted-foreground text-xs w-[30rem]">
                        {competence.description}
                      </p>
                    </div>
                  </button>
  
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="absolute top-2 right-2"
                      asChild
                    >
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(competence.id)}
                      >
                        Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setDialogOpen("delete");
                          setDialogData(competence);
                        }}
                        className="text-red-500"
                      >
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      <CompetencesDialogs 
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open ? (typeof open === "string" ? open : dialogOpen) : false)}
        data={dialogData}
        submits={{
          add: (data: React.FormEvent<HTMLFormElement>) => {},
          delete: (data: React.FormEvent<HTMLFormElement>) => {},
          view: (data: React.FormEvent<HTMLFormElement>) => {}
        }}
      />
    </TabsContent>
  )
}