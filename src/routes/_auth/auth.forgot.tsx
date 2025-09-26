import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute, Link } from '@tanstack/react-router';
import api from '@/services/api.service';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export const Route = createFileRoute('/_auth/auth/forgot')({
  component: ForgotPasswordComponent,
})

function ForgotPasswordComponent({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [sended, setSended] = useState(false);

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    setSended(true)
    api.post("/auth/forgot-password", { email })
  }

  return (
    <form onSubmit={send} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Redefinir senha</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira seu email para enviarmos um link de redefinição de senha.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className='text-foreground'>Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="nome@exemplo.com" 
            required 
            disabled={sended}
            className={sended ? "opacity-50" : "opacity-100"}
          />
        </div>
        <Button  
          type="submit" 
          className={cn("w-full text-background bg-foreground", sended ? "opacity-50 cursor-not-allowed" : "hover:bg-foreground/90")}
          disabled={sended}
        >
          {sended ? (
            <Check className='mr-2 size-4' />
          ) : "Enviar"}
        </Button>
      </div>
      <div className="text-center text-sm text-foreground">
        Voltar para o{" "}
        <Link
          to='/auth'
          className='underline underline-offset-4'
        >
          login
        </Link>
      </div>
    </form>
  )
}