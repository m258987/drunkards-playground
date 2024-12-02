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
      <AlertDialogTrigger asChild>
        <Button className="fixed top-12 right-2" size={'icon'}>
          <RotateCcwIcon />
        </Button>
      </AlertDialogTrigger>
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
