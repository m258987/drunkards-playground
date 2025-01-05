'use client'

import { useMenu } from '@/components/menu/menu-provider'
import { DEFAULT_DECK } from '@/constants/_default-deck'
import { tiles } from '@/constants/tiles'
import { getGameVersion } from '@/lib/get-game-version'
import { Deck } from '@/models/deck'
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

export const GameProvider = (props: { children: ReactNode; game: IGame }) => {
  const { actions, setGame, deck } = useMenu()
  const [version, setVersion] = useState(0)
  const [isPending, setPending] = useState(true)

  const game = useRef<IGame | null>(props.game ?? null)

  console.log('GAMESTATE', game.current?.toJSON())

  function updater(callback: (game: IGame) => IGame): IGame {
    callback(game.current as IGame)
    setTimeout(() => {
      setVersion((ps) => ps + 1)
      setGame(() => game.current?.toJSON() ?? null)
    }, 0)
    return game.current as IGame
  }
  useEffect(() => {
    const localGame = localStorage.getItem(`game@${getGameVersion()}`)
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
      {props.children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = use(GameContext)
  if (!context) throw new Error('useGame must be used inside GameProvider')

  return [context.game, context.setGame] as const
}
