'use client'

import { DEFAULT_DECK } from '@/constants/_default-deck'
import { tiles } from '@/constants/tiles'
import { GameProvider } from '@/hooks/use-game'
import { Game } from '@/models/game'
import { Tile } from '@/models/tile'
import { TooltipProvider } from '../ui/tooltip'
import { Board } from './board'

export const BoardContainer = () => {
  return (
    <TooltipProvider>
      <GameProvider
        game={
          new Game({
            deck: DEFAULT_DECK,
            players: [],
            tiles: tiles.map(
              (tile, i) => new Tile(i, tile.type, tile.rarities)
            ),
          })
        }
      >
        <Board />
      </GameProvider>
    </TooltipProvider>
  )
}
