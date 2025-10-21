import EditDialog from "./edit-dialog";
import DeleteDialog from "./delete-dialog";
import RegisterDialog from "./register-dialog";
import { useEffect, useState } from "react";

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
  const [render, setRender] = useState("");
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (open) {
      setRender(open as string);
      setDisplay(open as string);
    } else {
      setDisplay("");
      setTimeout(() => {
        setRender("");
      }, 300);
    }
  }, [open])

  return (
    <>
      {render === "register" && (
        <RegisterDialog
          open={display === "register"}
          onOpenChange={onOpenChange}
          onSubmit={submits.register}
        />
      )}

      {render === "delete" && (        
        <DeleteDialog
          open={display === "delete"}
          onOpenChange={onOpenChange}
          data={data}
          onSubmit={submits.delete}
        />
      )}

      {render === "edit" && (
        <EditDialog
          open={display === "edit"}
          onOpenChange={onOpenChange}
          data={data}
          onSubmit={submits.edit}
        />
      )}
    </>
  );
}
