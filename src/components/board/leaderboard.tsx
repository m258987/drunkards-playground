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
import { ChartColumnIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'

export const Leaderboard = () => {
  return (
    <>
      <div className="[@media(orientation:portrait)]:hidden absolute right-0 top-0 bottom-0 pt-20 bg-white">
        <LeaderboardTable />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="fixed top-2 right-2" size="icon">
            <ChartColumnIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Leaderboard</SheetTitle>
            <LeaderboardTable />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
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
        {game
          .getPlayers()
          .sort((a, b) => b.getPoints() - a.getPoints())
          .map((player, index) => {
            return (
              <TableRow key={player.getName()}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{player.getName()}</TableCell>
                <TableCell>{player.getPoints()}</TableCell>
              </TableRow>
            )
          })}
      </TableBody>
    </Table>
  )
}
