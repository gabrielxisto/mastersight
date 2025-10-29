import { useEffect, useState } from "react";
import ViewDialog from "./view-dialog";
import DeleteDialog from "./delete-dialog";
import AddDialog from "./add-dialog";

export default function ({
  open,
  onOpenChange,
  data,
  submits,
}: {
  open: boolean | string;
  onOpenChange: (open: boolean | string) => void;
  data: any;
  submits: {
    add: (data: React.FormEvent<HTMLFormElement>) => void;
    delete: (data: React.FormEvent<HTMLFormElement>) => void;
    view: (data: React.FormEvent<HTMLFormElement>) => void
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
      {render === "add" && (
        <AddDialog
          open={display === "add"}
          onOpenChange={onOpenChange}
          onSubmit={submits.add}
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

      {render === "view" && (
        <ViewDialog
          open={display === "view"}
          onOpenChange={onOpenChange}
          data={data}
          onSubmit={submits.view}
        />
      )}
    </>
  );
}
