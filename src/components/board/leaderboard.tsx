import { useGame } from '@/hooks/use-game'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Button } from '../ui/button'
import { ChartColumnIcon, CircleXIcon, InfoIcon, MedalIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { cn } from '@/lib/utils'
import { predefinedIcons } from '@/constants/predefined-icons'
import { predefinedColors } from '@/constants/predefined-colors'
import { Pawn } from './pawn'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export const Leaderboard = () => {
  const [game] = useGame()
  return (
    <>
      <div className="[@media(orientation:portrait)]:hidden absolute overflow-y-auto overflow-x-auto right-0 top-0 bottom-0 pt-20 bg-white">
        <h2>Макс точки: {game.getMaxPoints()}</h2>
        <LeaderboardTable />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed top-2 right-2" size="icon">
            <ChartColumnIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto overflow-x-auto">
          <SheetHeader>
            <SheetTitle>Leaderboard</SheetTitle>
            <LeaderboardTable />
            <HistoryTable />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const HistoryTable = () => {
  const [game] = useGame()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>№</TableHead>
          <TableHead>Играч</TableHead>
          <TableHead>Действие</TableHead>
          <TableHead>Info</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {game
          .getHistory()
          .slice()

          .map((history, index, { length }) => {
            return (
              <TableRow key={history.id}>
                <TableCell>{length - index}</TableCell>
                <TableCell>
                  {history.player && (
                    <Pawn
                      player={history.player}
                      suppressActiveState
                      suppressAnimations
                    />
                  )}
                </TableCell>
                <TableCell>{history.action} </TableCell>
                <TableCell>
                  {history.card && (
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={'ghost'} size={'icon'}>
                            <InfoIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          {history.card.getValue()}
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}

export const LeaderboardTable = () => {
  const [game] = useGame()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Поз.</TableHead>
          <TableHead>Име</TableHead>
          <TableHead>Точки</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ...game
            .getPlayers()
            .slice()
            .filter((p) => p.getState() == 'ACTIVE')
            .sort((a, b) => b.getPoints() - a.getPoints()),
          ...game
            .getPlayers()
            .slice()
            .filter((p) => p.getState() == 'DISQUALIFIED')
            .sort((a, b) => b.getPoints() - a.getPoints()),
        ].map((player, index) => {
          const isDisqualified = player.getState() == 'DISQUALIFIED'
          const isCurrent =
            game.getCurrentPlayer().getName() == player.getName()
          return (
            <TableRow
              className={cn(
                isDisqualified && 'opacity-60',
                isCurrent && 'bg-slate-100'
              )}
              key={player.getName()}
            >
              <TableCell>
                <span className="w-[2ch] inline-block">{index + 1}</span>{' '}
                {index <= 2 && !isDisqualified && (
                  <MedalIcon
                    className={cn(
                      'inline size-6 drop-shadow-md fill-gray-200 rounded-full',
                      index == 0 && 'text-[gold] fill-orange-300',
                      index == 1 && 'text-[silver] fill-slate-200',
                      index == 2 && 'text-[#CD7F32] fill-orange-300'
                    )}
                  />
                )}
                {isDisqualified && (
                  <CircleXIcon className="text-destructive inline size-6 drop-shadow-md" />
                )}
              </TableCell>
              <TableCell>
                <Pawn
                  suppressActiveState
                  suppressAnimations
                  player={player}
                  className="inline-flex align-middle mr-2"
                />
                {player.getName()}
              </TableCell>
              <TableCell>{player.getPoints()}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
