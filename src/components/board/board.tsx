import { useGame } from '@/hooks/use-game'
import { getEdgeCoordinates } from '@/lib/get-edge-coordiates'
import React, { useMemo } from 'react'
import { AddPlayersForm } from './add-players.form'
import Actions from './actions'
import { PickedCard } from './picked-card'
import { Leaderboard, LeaderboardTable } from './leaderboard'
import { Button } from '../ui/button'
import { RestartGameButton } from './restart-game-btn'
import { Logo } from '../logo/logo'
import { Dice } from './dice'
import { Pawn } from './pawn'
import { cn } from '@/lib/utils'

const BOARD_IMAGE = '/board.webp'
export const Board = () => {
  const [game, setGame] = useGame()
  const edgeCoordinates = useMemo(() => getEdgeCoordinates(10), [game])

  // todo move to component
  if (game.getState() == 'PREGAME') {
    return (
      <div
        key={game.getId()}
        className="flex items-center flex-col space-y-4 py-10 bg-secondary fixed inset-0"
      >
        <Logo className="max-w-[250px] h-fit  w-full text-primary" />
        <h1 className="text-2xl font-bold">Добави играчи</h1>
        <AddPlayersForm />
      </div>
    )
  }

  // todo move to component
  if (game.getState() == 'END') {
    return (
      <div key={game.getId()} className="p-4">
        <h1>Край на играта. Конфети.</h1>

        <LeaderboardTable />
        <Button
          onClick={() => {
            setGame((game) => {
              game.restartGame()
              return game
            })
          }}
        >
          Restart
        </Button>
      </div>
    )
  }

  if (game.getState() == 'PLAYING') {
    return (
      <div
        key={game.getId()}
        className="fixed bg-pink-400 inset-0 flex items-center justify-start text-[1.5vmin]"
      >
        <figure className="absolute max-h-full max-w-full aspect-square mr-auto">
          <img src={BOARD_IMAGE} alt="The board" className="object-contain" />
          <ol
            //   style={{ gridTemplateAreas: GRID_TEMPLATE_AREAS }}
            className="board-template-areas absolute p-[0.5%] gap-[0.5%] inset-0 grid grid-cols-10 grid-rows-10"
          >
            {game.getTiles().map((tile, i) => {
              const gridColumnStart = edgeCoordinates[i]?.[1] + 1
              const gridRowStart = edgeCoordinates[i]?.[0] + 1
              const players = game.getTilePlayers(tile.getIndex())

              return (
                <li
                  key={i}
                  className={cn(
                    'flex justify-center items-center',
                    players.length > 0 ? 'ring-4 ring-black ring-offset-2' : ''
                  )}
                  style={{ gridColumnStart, gridRowStart }}
                >
                  <span key={i} className="flex flex-wrap gap-2">
                    {/* {tile.getIndex()} {tile.getType()} */}
                    {players?.map((player) => (
                      <Pawn key={player.getName()} player={player} />
                    ))}
                  </span>
                </li>
              )
            })}
          </ol>
          <div className="absolute left-[12%] top-[12%] flex justify-center items-center ">
            <Dice />
          </div>
          <Actions />
          <PickedCard />
        </figure>
        <Leaderboard />
        <RestartGameButton />
      </div>
    )
  }
}
