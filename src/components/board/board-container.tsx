'use client'

import { cards } from '@/constants/deck'
import { tiles } from '@/constants/tiles'
import { GameProvider } from '@/hooks/use-game'
import { Deck } from '@/models/deck'
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
            cards: new Deck({ cards }).getCards(),
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
