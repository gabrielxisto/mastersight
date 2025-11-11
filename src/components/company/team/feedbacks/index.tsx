import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useCompanyStore, useUserStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import clsx from "clsx";
import CompetencesDialogs from "./feedbacks-dialogs";
import api from "@/services/api.service";

export default function Feedbacks({ data }: { data: any }) {
  const company = useCompanyStore();
  const user = useUserStore();
  const [users, setUsers] = useState<any>([]);
  const [dialogOpen, setDialogOpen] = useState<"add" | "view" | "delete" | false>(false);
  const [dialogData, setDialogData] = useState<any>(null);

  useEffect(() => {
    if (company.current) {
      api.get(`/companies/team?companyId=${company.current?.id}`).then((response) => {
        setUsers(response.data.team);
      });
    }
  }, [])

  const addFeedback = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const score = formData.get("score") as string;
    const content = formData.get("content") as string;

    const creatorId = company.current?.users.find((u: any) => u.userId === user.current?.id)?.id;

    api.post("/companies/feedbacks/add", { 
      userId: data.id,
      creatorId,
      companyId: company.current?.id,
      score,
      content
    }).then(() => {
      data.competences.push({
        userId: data.id,
        creatorId,
        companyId: company.current?.id,
        score,
        content,
        createdAt: new Date().toISOString()
      });
      setDialogOpen(false);
    }).catch(() => {
      setDialogOpen(false);
    });
  }

  return (
    <TabsContent value="feedbacks" className="max-h-[23.4rem] overflow-y-scroll space-y-6 scrollbar-hidden">
      <Card className="min-h-[28.4rem] mb-2">
        <CardHeader className="justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>Feedbacks</CardTitle>
            <CardDescription>Abaixo está todos os feedbacks listados do usuário.</CardDescription>
          </div>

          <Button
            onClick={() => {
              setDialogOpen("add");
              setDialogData({
                user: data.email || "",
                content: "",
                score: "0"
              });
            }}
            variant="default"
          >
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="-mx-3 h-full overflow-y-scroll p-3 scrollbar-hidden">
            {data.feedbacks.map((feedback: any, index) => {    
              return (
                <div
                  key={feedback.id}
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
                      setDialogData({
                        ...feedback,
                        index
                      });
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="col-start-2 row-span-2 font-medium">
                        Feedback #{feedback.id} | Autor: {users.find((u: any) => u.userId === feedback.creatorId)?.name || "Usuário deletado"}
                      </span>
                      <p className="text-muted-foreground text-xs w-[30rem]">
                        {feedback.content}
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
                        onClick={() => {
                          setDialogOpen("view");
                          setDialogData({
                            ...feedback,
                            index
                          });
                        }}
                      >
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setDialogOpen("delete");
                          setDialogData({
                            ...feedback,
                            index
                          });
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
          add: addFeedback,
        }}
      />
    </TabsContent>
  )
}