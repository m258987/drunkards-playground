import { useGame } from '@/hooks/use-game'
import React from 'react'
import { Button } from '../ui/button'
import { MenuIcon, RotateCcwIcon } from 'lucide-react'
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
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { getShorcutString } from '@/constants/shortcuts'
import { useEventListener } from 'usehooks-ts'
import { IS_APPLE } from '@/constants/environment'
import { useMenu } from '../menu/menu-provider'

export const MainMenuButton = () => {
  const { setStage, actions } = useMenu()
  const router = useRouter()

  function handleClick() {
    setStage('main')
    router.push('/')
  }

  useEventListener('keydown', (e) => {
    if (e.key == 'M' && IS_APPLE ? e.metaKey : e.ctrlKey) {
      alert('Cauth')
      e.preventDefault()
      handleClick()
    }
  })
  return (
    <AlertDialog>
      <Tooltip>
        <AlertDialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size={'icon'}>
              <MenuIcon />
            </Button>
          </TooltipTrigger>
        </AlertDialogTrigger>
        <TooltipContent>Главно меню {getShorcutString('MENU')}</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Сигурни ли сте, че искате да отидете в менюто?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Играта ви ще бъде запазена докато не натиснете бутона "Нова игра"
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={'outline'}>Отказ</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleClick}>Отиди в главното меню</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
