'use client'

import { DEFAULT_DECK } from '@/constants/_default-deck'
import { tiles } from '@/constants/tiles'
import { GameProvider } from '@/hooks/use-game'
import { Game } from '@/models/game'
import { Tile } from '@/models/tile'
import { TooltipProvider } from '../ui/tooltip'
import { Board } from './board'
import { useMenu } from '../menu/menu-provider'
import { useMemo } from 'react'
import { Deck } from '@/models/deck'
import { Card } from '@/models/card'

export const BoardContainer = () => {
  const { deck } = useMenu()
  const loadedDeck = useMemo(() => {
    if (!deck) {
      return DEFAULT_DECK
    }
    return new Deck({
      ...deck,
      id: deck.id,
      cards: deck.cards.map((c) => new Card(c)),
    })
  }, [deck])

  return (
    <TooltipProvider>
      <GameProvider
        game={
          new Game({
            deck: loadedDeck,
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
