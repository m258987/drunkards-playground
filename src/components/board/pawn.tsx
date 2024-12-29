import { IPlayer } from '@/models/types'
import React, { CSSProperties } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { predefinedIcons } from '@/constants/predefined-icons'
import { predefinedColors } from '@/constants/predefined-colors'
import { useGame } from '@/hooks/use-game'
import { cn } from '@/lib/utils'

type Props = {
  player: IPlayer
  className?: string
  style?: CSSProperties
  suppressAnimations?: boolean
  suppressActiveState?: boolean
}

export const Pawn = (props: Props) => {
  const [game] = useGame()
  const color = props.player.toJSON().color
  const Icon = predefinedIcons[predefinedColors.indexOf(color)]
  const isCurrent = game.getCurrentPlayer().getName() == props.player.getName()
  const isActive = game
    .getActivePlayers()
    .some((p) => p.getName() == props.player.getName())
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          style={{ ...props.style, background: color }}
          className={cn(
            'w-[32px] h-[32px] min-w-[32px] min-h-[32px] rounded-full text-white  flex items-center justify-center shadow-md shadow-black/75',
            isCurrent && !props.suppressAnimations ? 'animate-bounce' : '',
            !isActive && !props.suppressActiveState
              ? 'saturate-0 opacity-60'
              : '',
            props.className
          )}
        >
          <Icon className="w-5 h-5 mix-blend-difference" />
        </div>
      </TooltipTrigger>
      <TooltipContent>{props.player.getName()}</TooltipContent>
    </Tooltip>
  )
}
