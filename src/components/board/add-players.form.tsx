'use client'

import { useGame } from '@/hooks/use-game'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Player } from '@/models/player'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from 'lucide-react'
import { predefinedColors } from '@/constants/predefined-colors'
import { predefinedIcons } from '@/constants/predefined-icons'
const schema = z.object({
  players: z
    .array(
      z.object({
        name: z.string().min(3, 'Името трябва да има поне 3 знака'),
      })
    )
    .min(2, 'Минимум 2-ма играчи. Не може да си играеш сам...')
    .max(10, 'Макс 10, няма повече пионики...'),
  maxPoints: z.coerce
    .number()
    .min(10, 'Максималните точки трябва да са поне 10')
    .max(500, 'Не може да са повече от 500. Много дълго, чуек...')
    .default(35),
})

type FormType = z.infer<typeof schema>

export const AddPlayersForm = () => {
  const [game, setGame] = useGame()
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      players: game.getPlayers().length
        ? game.getPlayers().map((p) => ({ name: p.getName() }))
        : [{ name: '' }],
      maxPoints: game.getMaxPoints() ?? 35,
    },
  })

  const players = useFieldArray({
    control: form.control,
    name: 'players',
    keyName: 'hook_form_key',
  })

  function handleSubmit(data: FormType) {
    setGame((game) => {
      game
        .replacePlayers(
          data.players.map(
            (player, i) =>
              new Player(player.name, { color: predefinedColors[i] })
          )
        )
        .startGame()

      return game
    })
  }
  return (
    <Form {...form}>
      <form
        id="players-form"
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(handleSubmit, console.error)}
      >
        {players.fields.map((playerField, i) => {
          return (
            <FormField
              key={playerField.hook_form_key}
              control={form.control}
              name={`players.${i}.name`}
              render={({ field, fieldState, formState }) => {
                const Icon = predefinedIcons[i]
                return (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <div
                        style={{ background: predefinedColors[i] }}
                        className="border-2 border-input h-9 w-9 min-w-9 min-h-9 rounded-full flex justify-center items-center"
                      >
                        <Icon className="w-4 h-4 text-white drop-shadow-xl" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder={`Име на играч ${i + 1}`}
                          {...field}
                        />
                      </FormControl>

                      <Button
                        disabled={i == 0 || players.fields.length <= 1}
                        onClick={() => players.swap(i, i - 1)}
                        size="icon"
                        variant={'outline'}
                      >
                        <ChevronUpIcon />
                      </Button>
                      <Button
                        disabled={i == players.fields.length - 1}
                        onClick={() => players.swap(i, i + 1)}
                        size="icon"
                        variant={'outline'}
                      >
                        <ChevronDownIcon />
                      </Button>
                      <Button
                        disabled={players.fields.length <= 1}
                        onClick={() => players.remove(i)}
                        size="icon"
                        variant={'outline'}
                      >
                        <MinusCircleIcon />
                      </Button>
                    </div>
                    <FormMessage>{fieldState?.error?.message}</FormMessage>
                  </FormItem>
                )
              }}
            />
          )
        })}
        <Button
          type="button"
          disabled={players.fields.length >= 10}
          onClick={() => players.append({ name: '' }, { shouldFocus: true })}
        >
          <PlusCircleIcon /> Добави играч
        </Button>
        <hr />
        <FormField
          control={form.control}
          name={'maxPoints'}
          render={({ field, fieldState, formState }) => (
            <FormItem>
              <FormLabel>Максимални точки</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>{fieldState?.error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" form="players-form">
          Започни игра
        </Button>
      </form>
    </Form>
  )
}
