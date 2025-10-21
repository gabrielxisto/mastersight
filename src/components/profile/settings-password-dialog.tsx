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
import api from "@/services/api.service";
import { messages } from "@/lib/texts";
import toast from "react-hot-toast";

export default function () {
  const [open, setOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: false | string }>({
    password: false,
    confirmPassword: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: messages.error["passwords-do-not-match"],
      });
      return;
    }

    api
      .post("/users/update-password", { password })
      .then(() => {
        setOpen(false);
        toast.success(messages.success["password-updated"]);
      })
      .catch((error) => {
        if (error.response?.data?.error) {
          setErrors({
            ...errors,
            password: messages.error[error.response?.data?.error],
          });
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Alterar senha</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>
              Altere sua senha aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                onChange={() => setErrors({ ...errors, password: false })}
              />
              <p className="text-sm text-red-500">{errors.password}</p>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={() =>
                  setErrors({ ...errors, confirmPassword: false })
                }
              />
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
