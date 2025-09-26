import { useForm, FormProvider } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatCpf } from '@/lib/formater';
import type { UserFormValues } from './settings';

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"; 
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function({ 
  data, 
  errors, 
  set,
  setErrors
}: { 
  data: UserFormValues, 
  errors: { [key: string]: false | string },
  set: (data: UserFormValues) => void,
  setErrors: (errors: { [key: string]: false | string }) => void
}) {
  const form = useForm<UserFormValues>({
    defaultValues: data
  });

  return (
    <FormProvider {...form}>
      <form className='space-y-[2.6rem]'>
        <FormField
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input 
                  placeholder='Nome da empresa' {...field} 
                  value={data.name}
                  onChange={(e) => {
                    set({ ...data, name: e.target.value })
                    setErrors({ ...errors, name: false })
                  }}
                />
              </FormControl>
              <FormDescription>
                Este nome será exibido para todos que você possuir vinculo.
              </FormDescription>
              <FormMessage>{errors.name}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          name='cpf'
          render={() => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder='Seu CPF'
                  value={data.cpf}
                  onChange={(e) => {
                    const formatted = formatCpf(e.target.value)
                    set({ ...data, cpf: formatted })
                    setErrors({ ...errors, cpf: false })
                  }}
                />
              </FormControl>
              <FormDescription>
                Seu CPF apenas será exibido para os administradores de suas empresas.
              </FormDescription>
              <FormMessage>{errors.cpf}</FormMessage>
            </FormItem>
          )}
        />  

        <FormField
          name='date'
          render={() => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!data.birthday}
                      className="flex justify-start w-full h-full"
                    >
                      {data.birthday ? format(data.birthday, "PPP", { locale: ptBR }) : <p className='font-regular text-start text-muted-foreground'>Seleciona uma data</p>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={data.birthday} 
                      onSelect={(value) => {
                        if (value) set({ ...data, birthday: value })
                        setErrors({ ...errors, birthday: false })
                      }} 
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                Sua data de nascimento apenas será exibida para os administradores de suas empresas.
              </FormDescription>
              <FormMessage>{errors.birthday}</FormMessage>
            </FormItem>
          )}
        />

        {/* <FormField
          name='description'
          render={() => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input 
                  placeholder='Sua descrição' 
                  value={data.description}  
                  onChange={(e) => set({ ...data, description: e.target.value })}
                />
              </FormControl>
              <FormDescription>
                Adicione uma descrição, outros usuários poderão visualiza-la.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </form>
    </FormProvider>
  )
}