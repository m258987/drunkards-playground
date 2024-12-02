import { IPlayer } from '@/models/types'
import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { predefinedIcons } from '@/constants/predefined-icons'
import { predefinedColors } from '@/constants/predefined-colors'
import { useGame } from '@/hooks/use-game'
import { cn } from '@/lib/utils'

type Props = {
  player: IPlayer
}

export const Pawn = (props: Props) => {
  const [game] = useGame()
  const color = props.player.toJSON().color
  const Icon = predefinedIcons[predefinedColors.indexOf(color)]
  const isActive = game.getCurrentPlayer().getName() == props.player.getName()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{ background: color }}
          className={cn(
            'w-[32px] h-[32px] min-w-[32px] min-h-[32px] rounded-full text-white flex items-center justify-center shadow-md shadow-black/75',
            isActive ? 'animate-bounce' : ''
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{props.player.getName()}</TooltipContent>
    </Tooltip>
  )
}
