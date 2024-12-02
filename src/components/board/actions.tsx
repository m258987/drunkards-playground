import { useGame } from '@/hooks/use-game'
import React from 'react'
import { Button } from '../ui/button'

export default function Actions() {
  const [game, setGame] = useGame()

  async function handleDiceClick() {
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

      game.pickCard(currentTile)
      return game
    })
  }

  return (
    <div className="absolute right-[12%] top-[12%] flex flex-col space-y-2">
      <p>
        На ход е:{' '}
        <div
          style={{ background: game.getCurrentPlayer().toJSON().color }}
          className="size-9"
        />
        <strong className="text-2xl">
          {game.getCurrentPlayer()?.getName()}
        </strong>
      </p>
      <Button onClick={handleDiceClick}>Зар</Button>
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
