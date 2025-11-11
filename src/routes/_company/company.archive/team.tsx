import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, User } from "lucide-react";
import clsx from "clsx";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TeamDialogs from "@/components/company/team/team-dialogs";
import api from "@/services/api.service";
import { useCompanyStore, useUserStore } from "@/stores";
import toast from "react-hot-toast";
import { messages } from "@/lib/texts";
import { getInitials } from "@/lib/utils";
import { TeamHeader } from "@/components/company/team/team-header";
import { TeamContent } from "@/components/company/team/team-content";

export const Route = createFileRoute("/_company/company/archive/team")(
  {
    component: GeneralRegisterComponent,
  },
);

function GeneralRegisterComponent() {
  const company = useCompanyStore();
  const self = useUserStore();
  const [openDialog, setOpenDialog] = useState<boolean | string>(false);
  const [dialogData, setDialogData] = useState<any>(null);
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);

  const fetchUsers = async () => {
    if (company.current) {
      api
        .get(`/companies/team?companyId=${company.current?.id}`)
        .then((response) => {
          setTeam(response.data.team);
        });
    }
  };

  const registerUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const department = formData.get("department") as string;
    const salary = formData.get("salary") as string;
    const notify = formData.get("notify") as string;
    const permissions = formData.getAll("permissions") as string[];

    api
      .post("/companies/team/add", {
        companyId: company.current?.id,
        email,
        name,
        department,
        role,
        salary,
        notify,
        permissions,
      })
      .then((response) => {
        setOpenDialog(false);
        fetchUsers();
        toast.success(messages.success[response.data.message] || "Sucesso");
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          setOpenDialog(false);
          toast.error(messages.error[error.response?.data?.error] || "Erro");
        }
      });
  };

  const deleteUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userId = formData.get("id") as string;

    api
      .post('/companies/team/remove', { companyId: company.current?.id, userId: Number(userId) })
      .then(() => {
        setOpenDialog(false);
        fetchUsers();
        toast.success(messages.success["user-deleted"]);
        if (selectedUser?.id === Number(userId)) {
          setSelectedUser(null);
        }
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          toast.error(messages.error[error.response?.data?.error] || "Erro");
        }
      });
  };

  const editUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const department = formData.get("department") as string;
    const role = formData.get("role") as string;
    const salary = formData.get("salary") as string;
    const permissions = formData.getAll("permissions") as string[];

    api
      .post('/companies/team/edit', {
        companyId: company.current?.id,
        userId: dialogData?.id,
        department,
        role,
        salary,
        permissions,
      }).then(() => {
        setOpenDialog(false);
        fetchUsers();
        setSelectedUser(null);
        toast.success(messages.success["user-edited"]);
      })
  }

  useEffect(() => {
    fetchUsers();
    setSelectedUser(null);
  }, [company.current]);

  return (
    <main className="flex gap-8 px-10 py-5 h-full">
      <section className="w-[35.5rem] max-h-[43.5rem]">
        <header className="w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cadastro</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie a equipe da sua empresa aqui.
            </p>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center py-4">
              <Input
                placeholder="Pesquisar"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="max-w-80"
              />

              <Button
                variant="outline"
                className="w-8.5"
                onClick={() => setOpenDialog("register")}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </header>

        <div>
          <ScrollArea className="-mx-3 h-full overflow-y-scroll p-3 scrollbar-hidden">
            {team.map((user) => {
              if (user.name.toLowerCase().includes(filter.toLowerCase())) {
                const roleData = company.current ? company.current.roles.find(role => role.id === user.role) : { name: "Sem cargo", departmentId: 1 };
                const departmentData = company.current ? company.current.departments.find(dept => dept.id === roleData?.departmentId) : { name: "Sem departamento" };
  
                return (
                  <div
                    key={user.id}
                    className={clsx(
                      "relative group dark:bg-input/30 border hover:text-accent-foreground",
                      "flex flex-col min-h-20 w-full rounded-md mb-2 text-start text-sm",
                      "transition-all duration-150 cursor-pointer",
                      selectedUser?.id === user.id
                        ? "bg-muted dark:bg-muted"
                        : "hover:bg-muted/50 hover:dark:bg-muted/50",
                    )}
                  >
                    <button 
                      type="button"
                      className="flex items-start absolute w-full h-full left-0 top-0 px-3 py-3 text-start cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user.id === selectedUser?.id ? null : user)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="border border-input">
                          <AvatarImage
                            src={`${import.meta.env.VITE_CDN_ENDPOINT}/images/users/${user.image}`}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="col-start-2 row-span-2 font-medium">
                            {user.name}
                          </span>
                          <p className="text-muted-foreground text-xs">
                            {roleData?.name && <>{roleData?.name} | </>} Dep. {departmentData?.name}
                          </p>

                          {user.status === "invited" && (
                            <p className="text-xs text-[#f7910c]">Convite enviado</p>  
                          )}
                        </div>
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
                          onClick={() => navigator.clipboard.writeText(user.id)}
                        >
                          Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenDialog("edit");
                            setDialogData(user);
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        {user.email !== self.current?.email && (                          
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setOpenDialog("delete");
                                setDialogData({ id: user.id, name: user.name });
                              }}
                              className="text-red-500"
                            >
                              Deletar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              }
            })}
          </ScrollArea>
        </div>
      </section>

      <hr className="h-[38.5rem] w-[0.1rem] bg-muted" />

      <section className="relative w-full max-h-[43.5rem] overflow-y-hidden">
        {selectedUser ? (
          <div className="w-full space-y-5 scrollbar-hidden">            
            <TeamHeader 
              data={selectedUser}
              openDelete={() => {
                setOpenDialog("delete");
                setDialogData({ id: selectedUser.id, name: selectedUser.name });
              }} 
              openEdit={() => {
                setDialogData(selectedUser);
                setOpenDialog("edit");
              }}
            />
            <TeamContent data={selectedUser} />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 absolute left-[17rem] -translate-y-1/2 top-1/2 text-muted-foreground">
              <User size={18} />
              <p className="w-[15rem]">Nenhum usuário selecionado</p>
            </div>
          </>
        )}
      </section>

      <TeamDialogs
        open={openDialog}
        onOpenChange={setOpenDialog}
        data={dialogData}
        submits={{
          register: registerUser,
          delete: deleteUser,
          edit: editUser
        }}
      />
    </main>
  );
}
