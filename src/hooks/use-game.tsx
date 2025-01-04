'use client'

import { DEFAULT_DECK } from '@/constants/_default-deck'
import { tiles } from '@/constants/tiles'
import { Game } from '@/models/game'
import { Tile } from '@/models/tile'
import { GameJsonState, IGame } from '@/models/types'
import { Loader2 } from 'lucide-react'
import {
  createContext,
  ReactNode,
  use,
  useEffect,
  useRef,
  useState,
} from 'react'

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
  const [isPending, setPending] = useState(true)

  const game = useRef<IGame | null>(props.game ?? null)
  if (typeof game.current == 'undefined') {
    const currentDeck = DEFAULT_DECK
    game.current = new Game({
      deck: currentDeck,
      players: [],
      tiles: tiles.map((tile, i) => new Tile(i, tile.type, tile.rarities)),
    })
  }
  console.log('GAMESTATE', game.current?.toJSON())

  function updater(callback: (game: IGame) => IGame): IGame {
    callback(game.current as IGame)
    setTimeout(() => {
      setVersion((ps) => ps + 1)
      localStorage.setItem(
        `game@${process.env.version}`,
        JSON.stringify(game.current?.toJSON())
      )
    }, 0)
    return game.current as IGame
  }
  useEffect(() => {
    const localGame = localStorage.getItem(`game@${process.env.version}`)
    if (!localGame) return
    // todo must use ZOD here
    const gameState: GameJsonState | null = JSON.parse(localGame) ?? null
    if (gameState) {
      updater((game) => {
        game.restoreGame(gameState)
        return game
      })
    }
    setPending(false)
  }, [])

  return (
    <GameContext.Provider
      value={{ game: game.current as IGame, setGame: updater }}
    >
      {isPending ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <Loader2 className="!animate-spin size-8" />
        </div>
      ) : (
        props.children
      )}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = use(GameContext)
  if (!context) throw new Error('useGame must be used inside GameProvider')

  return [context.game, context.setGame] as const
}
