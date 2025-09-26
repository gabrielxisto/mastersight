import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pencil } from "lucide-react";
import { z } from 'zod';
import { createFileRoute } from '@tanstack/react-router';
import { ContentSection } from '@/components/company/content-section';
import ColorPicker from '@/components/ui/color-picker';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCompaniesStore, useCompanyStore } from '@/stores/';
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/services/api.service';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { messages } from '@/lib/texts';

export const Route = createFileRoute('/_company/company/_settings/settings/appearance')({
  component: AppearanceComponent,
})

const appearanceFormSchema = z.object({
  color: z.string().min(7, 'Por favor selecione uma cor'),
  image: z.string().optional(),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

function AppearanceComponent() {
  const companies = useCompaniesStore()
  const company = useCompanyStore()

  const [showEditImage, setShowEditImage] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const [color, setColor] = useState(company.current?.color || "#000000");
  const [image, setImage] = useState(company.current?.image || null);

  const defaultValues = useMemo(() => ({
    image: company.current?.image,
    color: company.current?.color,
  }), [company.current]);

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  const saveImage = (file: File | null) => {
    const formData = new FormData();
    formData.append('file', file as any);

    api.post("/companies/upload-image", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((response) => {
      form.setValue("image", response.data.hash);
      setImage(response.data.hash);
    });
  }

  function handleSubmit(data: AppearanceFormValues) {
    api.post('/companies/update', {
      id: company.current?.id,
      ...data,
    }).then((response) => {
      defaultValues.image = response.data.company.image;
      defaultValues.color = response.data.company.color;

      company.set(response.data.company);

      toast(messages.success["company-appearance-updated"]);

      api.get("/users/companies").then((response) => {
        companies.set(response.data.companies);
      })
    })
  } 

  useEffect(() => {
    form.setValue('color', color);
    form.setValue('image', image);
  }, [color, image])

  const watched = form.watch();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  
  useEffect(() => {
    setIsDisabled(watched.color === defaultValues.color &&
      watched.image === defaultValues.image);
  }, [watched, defaultValues])

  return (
    <ContentSection
      title='Aparência'
      desc='Gerencie a aparência da sua empresa.'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
          <ColorPicker 
            value={color}
            onChange={setColor}
            open={colorPickerOpen}
            onOpenChange={setColorPickerOpen}
            handleSave={() => setColorPickerOpen(false)}
          >
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <>
                      <Input 
                        className='pl-11' 
                        placeholder='Cor da empresa' 
                        {...field}
                        onChange={(e) => setColor(e.target.value)}
                      />
                      <div 
                        style={{ backgroundColor: color }}
                        className='absolute mt-5.5 size-9 rounded-l-md border border-white/20'
                      >
                        
                      </div>
                    </>
                  </FormControl>
                  <FormDescription>
                    Esta cor será exibida para todos que possuirem algum contato com a empresa.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </ColorPicker>    

          <FormField
            control={form.control}
            name='image'
            render={() => (
              <FormItem>
                <FormLabel>Imagem</FormLabel>
                <FormControl>
                  <div className='size-30'>
                    <Input
                      type='file'
                      className="absolute size-30 z-100 opacity-0 cursor-pointer"
                      onMouseEnter={() => setShowEditImage(true)}
                      onMouseLeave={() => setShowEditImage(false)}
                      onChange={e => saveImage(e.target.files?.[0] || null)}
                    />

                    <div className={clsx(
                      'grid place-items-center relative size-30 bg-sidebar',
                      'rounded-lg border border-black/20 p-1'
                    )}>
                      <div className={clsx(
                        'grid place-items-center absolute z-20 left-0 top-0 transition-all duration-300',
                        'rounded-lg size-full bg-black/30 opacity-0',
                        showEditImage && 'opacity-100',
                      )}>
                        <Pencil color='#FFFFFF' />
                      </div>
                      <Image color='#FFFFFF80' />
                      <img 
                        src={`${import.meta.env.VITE_CDN_ENDPOINT}/images/companies/${image}`}
                        alt='Imagem da empresa'
                        className='absolute size-full object-contain rounded-lg'
                        onError={(e) => {
                          e.currentTarget.style.opacity = '0';
                        }}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Esta imagem será exibida para todos que possuirem algum contato com a empresa.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className={clsx('cursor-pointer', isDisabled && 'opacity-80 cursor-default')} disabled={isDisabled} type='submit'>Salvar</Button>
        </form>
      </Form>
    </ContentSection>
  )
}
