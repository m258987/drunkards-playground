'use client'
import { cards } from '@/constants/deck'
import { tiles } from '@/constants/tiles'
import { Deck } from '@/models/deck'
import { Game } from '@/models/game'
import { Tile } from '@/models/tile'
import { GameJsonState, IGame, IPlayer } from '@/models/types'
import {
  createContext,
  ReactNode,
  use,
  useEffect,
  useRef,
  useState,
} from 'react'
import { json } from 'stream/consumers'

interface IGameContext {
  game: IGame
  setGame: (setter: (game: IGame) => IGame) => IGame
}
const GameContext = createContext<IGameContext>(undefined!)

export const GameProvider = (props: {
  children: ReactNode
  game?: IGame | undefined
}) => {
  const [version, setVersion] = useState(0)

  const game = useRef<IGame | null>(props.game ?? null)
  if (typeof game.current == 'undefined') {
    const currentDeck = new Deck({ cards })
    game.current = new Game({
      cards: currentDeck.getCards(),
      players: [],
      tiles: tiles.map((tile, i) => new Tile(i, tile.type, tile.rarities)),
    })
  }
  console.log(game.current?.toJSON())

  function updater(callback: (game: IGame) => IGame): IGame {
    callback(game.current as IGame)
    setTimeout(() => {
      setVersion((ps) => ps + 1)
      localStorage.setItem('game', JSON.stringify(game.current?.toJSON()))
    }, 0)
    return game.current as IGame
  }
  useEffect(() => {
    const localGame = localStorage.getItem('game')
    if (!localGame) return
    // todo must use ZOD here
    const gameState: GameJsonState | null = JSON.parse(localGame) ?? null
    if (gameState) {
      updater((game) => {
        game.restoreGame(gameState)
        return game
      })
    }
  }, [])

  return (
    <GameContext.Provider
      value={{ game: game.current as IGame, setGame: updater }}
    >
      {props.children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = use(GameContext)
  if (!context) throw new Error('useGame must be used inside GameProvider')

  return [context.game, context.setGame] as const
}
