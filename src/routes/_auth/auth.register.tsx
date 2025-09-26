import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from '@/services/api.service';
import { messages } from '@/lib/texts';
import { formatCpf } from '@/lib/formater';

export const Route = createFileRoute('/_auth/auth/register')({
  component: RegisterComponent,
})

function RegisterComponent() {
  const [errors, setErrors] = useState<{[key: string]: false | string}>({})

  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email"),
      name: formData.get("name"),
      cpf: formData.get("cpf"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (data.password !== data.confirmPassword) {
      setErrors((prev) => ({ 
        ...prev, 
        "password": messages.error["passwords-do-not-match"],
        "confirmPassword": messages.error["passwords-do-not-match"]
      }));

    }

    if (String(data.cpf).length < 14) {
      setErrors((prev) => ({ ...prev, cpf: messages.error["invalid-cpf"] }));
    }

    api.post("/users/create", data).catch((error) => {
      if (error.response?.data?.error) {
        const errorsMaps: Record<string, string> = {
          "passwords-do-not-match": "confirmPassword",
          "cpf-already-registered": "cpf",
          "email-already-registered": "email",
          "weak-password": "password",
          "invalid-email": "email",
        }

        setErrors((prev) => ({ 
          ...prev, 
          [errorsMaps[error.response?.data?.error]]: messages.error[error.response?.data?.error] 
        }));
      }
    })
  }

  return (
    <form onSubmit={signUp} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira seus dados para criar uma conta.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          {errors.email && <span className='text-sm text-red-600'>{errors.email}</span>}
          <Label htmlFor="email" className='text-foreground'>Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="nome@exemplo.com" 
            required 
            className='text-foreground'
            onChange={() => setErrors((prev) => ({ ...prev, email: false }))}
          />
        </div>
        <div className="grid gap-3">
          {errors.name && <span className='text-sm text-red-600'>{errors.name}</span>}
          <Label htmlFor="name" className='text-foreground'>Nome</Label>
          <Input 
            id="name" 
            name="name" 
            type="name" 
            placeholder="João da Silva Santos" 
            required 
            className='text-foreground'
            onChange={() => setErrors((prev) => ({ ...prev, name: false }))}
          />
        </div>
        <div className="grid gap-3">
          {errors.cpf && <span className='text-sm text-red-600'>{errors.cpf}</span>}
          <Label htmlFor="cpf" className='text-foreground'>CPF</Label>
          <Input 
            id="cpf" 
            name="cpf" 
            type="cpf" 
            placeholder="123.456.789-00" 
            required 
            className='text-foreground'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setErrors((prev) => ({ ...prev, cpf: false }))
              
              e.target.value = formatCpf(e.target.value)
            }}
          />
        </div>
        <div className="grid gap-3">
          {errors.password && <span className='text-sm text-red-600'>* {errors.password}</span>}
          <Label htmlFor="password" className='text-foreground'>Senha</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className='text-foreground'
            onChange={() => setErrors((prev) => ({ ...prev, password: false }))}
          />
        </div>
        <div className="grid gap-3">
          {errors.confirmPassword && <span className='text-sm text-red-600'>* {errors.confirmPassword}</span>}
          <Label htmlFor="confirmPassword" className='text-foreground'>Confirmar Senha</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type="confirmPassword" 
            required 
            className='text-foreground'
            onChange={() => {setErrors((prev) => ({ ...prev, confirmPassword: false }))}}
          />
        </div>

        <Button type="submit" className="w-full text-background bg-foreground">
          Criar
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
