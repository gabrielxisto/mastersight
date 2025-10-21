import EditDialog from "./edit-dialog";
import DeleteDialog from "./delete-dialog";
import RegisterDialog from "./register-dialog";

export default function ({
  open,
  onOpenChange,
  data,
  submits,
}: {
  open: boolean | string;
  onOpenChange: (open: boolean) => void;
  data: any;
  submits: {
    register: (data: React.FormEvent<HTMLFormElement>) => void;
    delete: (data: React.FormEvent<HTMLFormElement>) => void;
    edit: (data: React.FormEvent<HTMLFormElement>) => void
  };
}) {
  return (
    <>
      <RegisterDialog
        open={open === "register"}
        onOpenChange={onOpenChange}
        onSubmit={submits.register}
      />

      <DeleteDialog
        open={open === "delete"}
        onOpenChange={onOpenChange}
        data={data}
        onSubmit={submits.delete}
      />

      <EditDialog
        open={open === "edit"}
        onOpenChange={onOpenChange}
        data={data}
        onSubmit={submits.edit}
      />
    </>
  );
}
