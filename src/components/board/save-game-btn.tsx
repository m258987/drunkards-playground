import { useGame } from '@/hooks/use-game'
import React, { useCallback } from 'react'
import { Button } from '../ui/button'
import { RotateCcwIcon, SaveIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { useMenu } from '../menu/menu-provider'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { v4 } from 'uuid'
import moment from 'moment'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { getShorcutString } from '@/constants/shortcuts'

const schema = z.object({
  name: z
    .string({
      required_error: 'Полето е задължително.',
      invalid_type_error: 'Трябва да е текст.',
    })
    .max(60, 'Максимум 60 символа'),
  id: z.string().optional().default(v4()),
})

type FormType = z.infer<typeof schema>

export const SaveGameButtonForm = () => {
  const { actions, saves } = useMenu()
  const [game, setGame] = useGame()

  const form = useForm<FormType>({
    defaultValues: { name: moment().format('Игра HH:mm, DD/MM/YY') },
    resolver: zodResolver(schema),
  })

  const handleSubmit = useCallback(
    (data: FormType) => {
      console.log('DATA', data)

      actions.updateSave(data.id, data.name, game.toJSON()!)
    },
    [form]
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} id="save-form">
        <FormField
          control={form.control}
          name={'name'}
          render={({ field, fieldState, formState }) => (
            <FormItem>
              <FormLabel>Име</FormLabel>
              <FormControl>
                <Input placeholder="Моята игра" autoFocus {...field} />
              </FormControl>
              <FormMessage>{fieldState?.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'id'}
          render={({ field, fieldState, formState }) => (
            <FormItem>
              <FormControl>
                <ul>
                  {saves.map((save) => (
                    <li
                      data-selected={save.id == field.value}
                      key={save.id}
                      onClick={() => {
                        field.onChange(save.id)
                        form.setValue('name', save.name)
                      }}
                      className="data-[selected=true]:border-2 rounded-full"
                    >
                      <h3 className="font-bold">{save.name}</h3>
                      <p>{moment(save.updatedAt).format('HH:mm DD/MM/YY')}</p>
                    </li>
                  ))}
                </ul>
              </FormControl>
              <FormMessage>{fieldState?.error?.message}</FormMessage>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export const SaveGameButton = () => {
  return (
    <AlertDialog>
      <Tooltip delayDuration={100}>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button title="Save game" size={'icon'}>
              <SaveIcon />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>Запиши {getShorcutString('SAVE')}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Запишете играта</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          За да може да я продължите по всяко време.
        </AlertDialogDescription>
        <SaveGameButtonForm />
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={'outline'}>Отказ</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" form="save-form" variant={'destructive'}>
              Запиши
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
