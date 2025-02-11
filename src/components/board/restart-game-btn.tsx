import { useGame } from '@/hooks/use-game'
import React from 'react'
import { Button } from '../ui/button'
import { RotateCcwIcon } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { getShorcutString } from '@/constants/shortcuts'

export const RestartGameButton = () => {
  const [game, setGame] = useGame()

  function handleRestart() {
    setGame((game) => {
      game.restartGame()
      return game
    })
  }
  return (
    <AlertDialog>
      <Tooltip delayDuration={100}>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size={'icon'}>
              <RotateCcwIcon />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>
          Рестартирай играта {getShorcutString('RESTART')}
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Сигурни ли сте, че искате да рестартирате?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Целият прогрес ще бъде изгубен.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={'outline'}>Отказ</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleRestart} variant={'destructive'}>
              Рестартирай
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
