import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCompanyStore } from "@/stores/";
import api from "@/services/api.service";
import toast from "react-hot-toast";
import { messages } from "@/lib/texts";
import DepartmentsDialogs from "@/components/company/departments/departments-dialogs";

export const Route = createFileRoute("/_company/company/archive/departments")({
  component: DepartmentsComponent,
});

type Data = {
  id: number;
  name: string;
  description: string;
  users: number;
  roles: number;
  status: string;
};

type ColumnDefWithName = ColumnDef<Data[]> & { name?: string };

function DepartmentsComponent() {
  const columns: ColumnDefWithName[] = [
    {
      name: "ID",
      accessorKey: "id",
      header: () => <div className="uppercase text-center">ID</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("id")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      name: "Nome",
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="text-start capitalize truncate">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      name: "Descrição",
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="text-start truncate">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      name: "Usuários",
      accessorKey: "users",
      header: () => <div className="text-center">Usuários</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("users")}</div>
      ),
    },
    {
      name: "Cargos",
      accessorKey: "roles",
      header: () => <div className="text-center">Cargos</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.getValue("roles")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const department = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(department.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {company.current.permissions?.includes("editDepartments") && <DropdownMenuItem
                onClick={() => {
                  setOpenDialog("edit");
                  setDialogData(department);
                }}
              >
                Editar
              </DropdownMenuItem>}
              {company.current.permissions?.includes("deleteDepartments") && <DropdownMenuItem
                onClick={() => {
                  setOpenDialog("delete");
                  setDialogData(department);
                }}
                className="text-red-500"
              >
                Deletar
              </DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const company = useCompanyStore();
  const [openDialog, setOpenDialog] = useState<boolean | string>(false);
  const [dialogData, setDialogData] = useState<any>(null);
  const [departments, setDepartments] = useState([]);

  const table = useReactTable({
    data: Array.isArray(departments) ? departments : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 9,
      },
    },
  });

  const createDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const salary = formData.get("salary");

    api
      .post("/companies/departments/create", {
        companyId: company.current?.id,
        name,
        description,
        salary,
      })
      .then(() => {
        setOpenDialog(false);
        toast.success(messages.success["department-created"]);
        refreshDepartments();
      });
  };

  const editDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const salary = formData.get("salary");
    const id = dialogData?.id;

    api
      .post("/companies/departments/update", {
        id,
        companyId: company.current?.id,
        name,
        description,
        salary,
      })
      .then(() => {
        setOpenDialog(false);
        toast.success(messages.success["department-edited"]);
        refreshDepartments();
      });
  };

  const deleteDepartment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get("id");

    api
      .post("/companies/departments/delete", {
        id: Number(id),
        companyId: company.current?.id,
      })
      .then(() => {
        setOpenDialog(false);
        toast.success(messages.success["department-deleted"]);
        refreshDepartments();
      });
  };

  const refreshDepartments = () => {
    if (company.current?.id) {
      api
        .get(`/companies/departments?companyId=${company.current?.id}`)
        .then((response) => {
          setDepartments(response.data.departments);
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    }
  };

  useEffect(() => {
    refreshDepartments();
  }, [company.current?.id]);

  return (
    <main className="px-10 py-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Departamentos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os departamentos da sua empresa aqui.
        </p>
      </header>

      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <Input
            placeholder="Pesquisar"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex gap-2">
            {company.current.permissions?.includes("createDepartments") && (
              <Button
                onClick={() => setOpenDialog("add")}
                className="ml-auto cursor-pointer"
              >
                Criar <Plus />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto cursor-pointer">
                  Colunas <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const label = (column.columnDef as ColumnDefWithName).name;

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {label}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="truncate max-w-[180px]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            {table.getCanPreviousPage() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Voltar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>

      <DepartmentsDialogs
        open={openDialog}
        onOpenChange={setOpenDialog}
        data={dialogData}
        submits={{
          add: createDepartment,
          edit: editDepartment,
          delete: deleteDepartment,
        }}
      />
    </main>
  );
}
