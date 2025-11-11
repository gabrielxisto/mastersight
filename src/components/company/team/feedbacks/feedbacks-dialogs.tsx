import { useEffect, useState } from "react";
import ViewDialog from "./view-dialog";
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
  }, [open]);

  return (
    <>
      {render === "add" && (
        <AddDialog
          data={data}
          open={display === "add"}
          onOpenChange={onOpenChange}
          onSubmit={submits.add}
        />
      )}

      {render === "view" && (
        <ViewDialog
          open={display === "view"}
          onOpenChange={onOpenChange}
          data={data}
        />
      )}
    </>
  );
}
