import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import Infos from './settings-infos';
import Appearance from './settings-appearance';
import { useUserStore } from '@/stores';
import api from '@/services/api.service';
import SettingsPasswordDialog from './settings-password-dialog';
import toast from 'react-hot-toast';
import { messages } from '@/lib/texts';

const UserForm = z.object({
  name: z
    .string()
    .min(1, 'Por favor insira o seu nome.')
    .min(2, 'O nome deve ter pelo menos mais de 2 caracteres.')
    .max(30, 'O nome não deve ter mais de 30 caracteres.'),
  cpf: z.string().min(14, 'O CPF deve ter 14 caracteres.'),
  birthday: z
    .date()
    .refine((inputDate) => {
      const minDate = new Date('1900-01-01');
      const maxDate = new Date();
      return (
        inputDate >= minDate &&
        inputDate <= maxDate
      );
    }, {
      message: 'Data de nascimento inválida.',
    }),
  description: z.string('Insira uma descrição.').optional(),
  image: z.string().optional(),
})

export type UserFormValues = z.infer<typeof UserForm>

export default function() {
  const user = useUserStore();
  const [defaultValues, setDefaultValues] = useState<UserFormValues>({
    name: user.current?.name || '',
    cpf: user.current?.cpf || '',
    birthday: user.current?.birthday ? new Date(user.current.birthday) : new Date(),
    image: user.current?.image || '',
    description: user.current?.description || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: false | string }>({
    name: false,
    cpf: false,
    description: false,
    image: false,
  });

  const [formValues, setFormValues] = useState<UserFormValues>(defaultValues);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    let newIsDisabled = true;

    Object.values(defaultValues).forEach((value, index) => {
      if (value !== Object.values(formValues)[index]) {
        newIsDisabled = false;
      }
    });

    setIsDisabled(newIsDisabled);
  }, [formValues]);

  const handleSubmit = () => {
    const result = UserForm.safeParse(formValues);
    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      for (const err of result.error.issues) {                
        const key = typeof err.path[0] === 'string' ? err.path[0] : String(err.path[0]);
        if (key) {
          fieldErrors[key] = err.message;
        }
      }   
      setErrors(fieldErrors);
    } else {
      api.post("/users/update", formValues).then((response) => {
        if (response.status === 200) {
          setDefaultValues({ ...formValues });
          user.set(response.data.user);
          setIsDisabled(true);
          setErrors({});
          toast(messages.success["user-updated"]);
        }
      })
    }
  }

  return (
    <main
      className={cn(
        'flex flex-col justify-center px-17 py-14',
      )}
    >
      <div className='space-y-0.5 w-full'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Sua Conta
        </h1>
        <p className='text-muted-foreground'>
          Gerencie e altere as configurações da sua conta para as que você melhor preferir.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className='flex flex-1 flex-col gap-8 space-y-2 overflow-hidden md:space-y-2 lg:space-y-0 lg:space-x-12'>
        <div className='flex gap-9 w-full overflow-y-hidden p-1'>
          <Infos 
            data={formValues} 
            errors={errors} 
            set={setFormValues} 
            setErrors={setErrors}
          />
          <Appearance data={formValues} errors={errors} set={setFormValues} />
        </div>
        
        <div className='flex gap-2'>
          <SettingsPasswordDialog />

          <Button 
            onClick={handleSubmit}
            className={isDisabled ? "opacity-80 cursor-default w-fit" : "w-fit"} 
            disabled={isDisabled}
          >
            Salvar
          </Button>
        </div>
      </div>
    </main>
  )
}
