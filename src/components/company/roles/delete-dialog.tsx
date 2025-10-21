import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import clsx from "clsx";

export default function ({
  open,
  onOpenChange,
  data,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: any;
  onSubmit: (data: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [available, setAvailable] = useState<boolean>(false);

  const checkAvailable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (data && value === data.id.toString()) {
      setAvailable(true);
    } else {
      setAvailable(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[26.56rem]">
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-red-500">Deletar cargo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar{" "}
              <b className="uppercase">{data?.name}</b>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="roles-id">ID</Label>
              <Input
                id="roles-id"
                name="id"
                required
                placeholder="Insira o ID do cargo para confirmar"
                onChange={checkAvailable}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              disabled={!available}
              type="submit"
              className={clsx(
                "text-white bg-red-500 hover:bg-red-600 focus:ring-red-500",
                !available && "opacity-50 cursor-default",
              )}
            >
              Deletar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
