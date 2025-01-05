import { useGame } from '@/hooks/use-game'
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { Button } from '../ui/button'
import { Pawn } from './pawn'
import { getShorcutString } from '@/constants/shortcuts'
import { useEventListener } from 'usehooks-ts'

export default function Actions() {
  const [game, setGame] = useGame()
  const [isDicing, startDicing] = useTransition()

  const ref = useRef<HTMLButtonElement>(null)
  async function handleDiceClick() {
    startDicing(async () => {
      for (let i = 0; i < 15; i++) {
        setGame((game) => {
          game.rollDice()

          return game
        })
        await diceSleep(i * 25)
      }
      for (let i = 0; i < game.getDice(); i++) {
        setGame((game) => {
          game.moveCurrentPlayerBy(1)
          return game
        })
        await diceSleep(200)
      }
      setGame((game) => {
        const currenPlayer = game.getCurrentPlayer()
        const currentTile = game.getPlayerLocation(currenPlayer)

        game.putHistory({
          player: currenPlayer,
          action: `Хвърли зар: ${game.getDice()} и се премести на плочка: ${currentTile.getIndex()}`,
        })

        game.pickCard(currentTile)

        return game
      })
    })
  }

  useEventListener('keydown', (e) => {
    const currentDocumentFocus = document.activeElement

    if (
      e.key == ' ' &&
      currentDocumentFocus &&
      currentDocumentFocus.tagName == 'BODY'
    ) {
      ref.current?.click()
    }
  })

  return (
    <div className="absolute right-[12%] top-[12%] flex flex-col items-end text-right space-y-2">
      <p>
        На ход е:{' '}
        <Pawn
          className="inline-flex align-middle mr-2"
          player={game.getCurrentPlayer()}
          suppressActiveState
          suppressAnimations
        />
        <strong className="text-2xl align-middle">
          {game.getCurrentPlayer()?.getName()}
        </strong>
      </p>
      <Button
        id="dice-btn"
        ref={ref}
        disabled={!!game.getDeck().getSelectedCard() || isDicing}
        onClick={handleDiceClick}
      >
        Зар {getShorcutString('ROLL_DICE')}
      </Button>
      <div>Макс точки: {game.getMaxPoints()}</div>
    </div>
  )
}

async function diceSleep(ms: number) {
  return new Promise((r) =>
    setTimeout(() => {
      r(undefined)
    }, ms)
  )
}
