import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Role } from "@/types";
import { ChevronDown, MoreHorizontal, Plus } from "lucide-react";
import toast from "react-hot-toast";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
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
import { FacetedFilter } from "@/components/company/faceted-filter";
import RolesDialogs from "@/components/company/roles/roles-dialogs";

import { useCompanyStore } from "@/stores/";
import { messages } from "@/lib/texts";
import api from "@/services/api.service";

export const Route = createFileRoute("/_company/company/archive/roles")({
  component: RolesComponent,
});

type ColumnDefWithName = ColumnDef<Role[]> & { name?: string };

function RolesComponent() {
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
      name: "Departamento",
      accessorKey: "department",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue?.length) return true;
        const cellValue = row.getValue(columnId);
        if (Array.isArray(cellValue)) {
          return cellValue.some((v) => filterValue.includes(v));
        }
        return filterValue.includes(cellValue);
      },
      header: () => <div className="text-center">Departamento</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("department")}
        </div>
      ),
    },
    {
      name: "Salário",
      accessorKey: "salary",
      header: () => <div className="text-center">Salário</div>,
      cell: ({ row }) => (
        <div className="text-center uppercase">
          R$ {row.getValue("salary")?.toLocaleString("pt-BR")}
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const role = row.original;

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
                onClick={() => navigator.clipboard.writeText(role.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog("edit");
                  setDialogData(role);
                }}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog("delete");
                  setDialogData(role);
                }}
                className="text-red-500"
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const company = useCompanyStore();
  const [openDialog, setOpenDialog] = useState<boolean | string>(false);
  const [dialogData, setDialogData] = useState<any>(null);
  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState([]);

  const table = useReactTable({
    data: Array.isArray(roles) ? roles : [],
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

  const createRole = (
    event: React.FormEvent<HTMLFormElement>,
    departmentId: string,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const salary = formData.get("salary");

    api
      .post("/companies/roles/create", {
        companyId: company.current?.id,
        name,
        departmentId: Number(departmentId),
        salary,
      })
      .then(() => {
        setOpenDialog(false);
        toast.success(messages.success["role-created"]);
        refreshRoles();
      });
  };

  const editRole = (
    event: React.FormEvent<HTMLFormElement>,
    departmentId: string,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const salary = formData.get("salary");
    const id = dialogData?.id;

    api
      .post("/companies/roles/update", {
        id,
        companyId: company.current?.id,
        name,
        departmentId: Number(departmentId),
        salary,
      })
      .then(() => {
        setOpenDialog(false);
        toast.success(messages.success["role-updated"]);
        refreshRoles();
      });
  };

  const deleteRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const id = formData.get("id");

    api
      .post("/companies/roles/delete", {
        id: Number(id),
        companyId: company.current?.id,
      })
      .then(() => {
        setOpenDialog(false);
        toast.success(messages.success["role-deleted"]);
        refreshRoles();
      });
  };

  const refreshRoles = () => {
    if (company.current?.id) {
      api
        .get(`/companies/roles?companyId=${company.current?.id}`)
        .then((response) => {
          setRoles(response.data.roles);
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    }
  };

  useEffect(() => {
    refreshRoles();
  }, [company.current?.id]);

  useEffect(() => {
    if (company.current?.id) {
      api
        .get(`/companies/departments?companyId=${company.current?.id}`)
        .then((response) => {
          setFilters(
            response.data.departments.map((department: any) => ({
              label: department.name,
              value: department.name,
            })),
          );
        })
        .catch((error) => {
          console.log(error.response.data.error);
        });
    }
  }, []);

  return (
    <main className="px-10 py-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Cargos</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os cargos da sua empresa aqui.
        </p>
      </header>

      <div className="w-full">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="Pesquisar"
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
              className="w-80"
            />

            <FacetedFilter
              column={table.getColumn("department")}
              title="Departamento"
              options={filters}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setOpenDialog("add")}
              className="ml-auto cursor-pointer"
            >
              Criar <Plus />
            </Button>
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

      <RolesDialogs
        open={openDialog}
        onOpenChange={setOpenDialog}
        data={dialogData}
        submits={{
          add: createRole,
          edit: editRole,
          delete: deleteRole,
        }}
      />
    </main>
  );
}
