import { useGame } from '@/hooks/use-game'
import { cn } from '@/lib/utils'
import React from 'react'

export const Dice = () => {
  const [game] = useGame()
  const value = game.getDice()
  const activeDots = getActiveDots(value)
  return (
    <div className="bg-background w-[64px] h-[64px] rounded-md p-2 gap-2 grid grid-cols-3 grid-rows-3">
      {Array.from({ length: 9 }).map((_, i) => {
        const isActive = activeDots.includes(i)
        return (
          <div
            key={i}
            className={cn(
              'w-full h-full  rounded-full',
              isActive ? 'bg-black' : ''
            )}
          ></div>
        )
      })}
    </div>
  )
}

/**
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */

function getActiveDots(value: number) {
  switch (value) {
    case 1:
      // just middle dot
      return [4]
    case 2:
      return [0, 8]
    case 3:
      return [0, 4, 8]
    case 4:
      return [0, 2, 6, 8]
    case 5:
      return [0, 2, 4, 6, 8]
    case 6:
      return [0, 2, 3, 5, 6, 8]
    default:
      return []
  }
}
