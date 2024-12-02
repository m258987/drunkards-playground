import { useGame } from '@/hooks/use-game'
import React, { CSSProperties, useMemo } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Card } from '@/models/card'
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as CardWrapper,
} from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { pointsByRarity } from '@/constants/points-by-rarity'
import { DialogTitle } from '@radix-ui/react-dialog'
import _ from 'lodash'
import handlebars from 'handlebars'
import { colorsByRarity } from '@/constants/colors-by-rarity'
import { iconsByType } from '@/constants/icons-by-type'
import { colorsByType } from '@/constants/colors-by-type'

export const PickedCard = () => {
  const [game, setGame] = useGame()
  const currentCard = game.getCurrentCard()
  const id = currentCard?.getId()
  const randomPlayer = useMemo(() => {
    return _.sample(
      game
        .getActivePlayers()
        ?.filter((p) => p.getName() != game.getCurrentPlayer().getName())
    )
  }, [id])
  console.log('randomPlayer', randomPlayer)

  const handlebarsTemplate = useMemo(
    () => ({
      randomPlayer: `<strong>${randomPlayer?.getName()}</strong>`,
    }),
    []
  )
  const value = useMemo(() => {
    return handlebars.compile(currentCard?.getValue() ?? '', {
      noEscape: true,
    })(handlebarsTemplate)
  }, [handlebarsTemplate, randomPlayer, currentCard])

  const points = useMemo(
    () => (currentCard ? pointsByRarity.get(currentCard.getRarity()) : 0),
    [id]
  )

  const cardColor = useMemo(
    () => (currentCard ? colorsByType.get(currentCard?.getType()) : 'gray'),
    [id]
  )

  const color = useMemo(
    () =>
      currentCard
        ? colorsByRarity.get(currentCard?.getRarity())
        : colorsByRarity.values().toArray()[0],
    [id]
  )

  const iconSrc = useMemo(
    () => (currentCard ? iconsByType.get(currentCard?.getType()) : ''),
    [id]
  )
  return (
    <Dialog open={!!game.getCurrentCard()}>
      <DialogContent
        style={{ '--bg': cardColor, '--border-color': color } as CSSProperties}
        NOX
        className="border-4 border-[var(--border-color)] !rounded-3xl p-4 w-[400px] h-[600px] flex flex-col bg-[var(--bg)]"
      >
        <DialogTitle className="sr-only">Преглед на карта</DialogTitle>
        {currentCard != null && (
          <>
            {(currentCard.getRarity() == 'LEGENDARY' ||
              currentCard.getRarity() == 'EPIC') && (
              <div
                style={{ backgroundSize: '1000% 1000%' }}
                className="absolute z-10 pointer-events-none bg-[url(/glint-2.jpg)] rounded-3xl inset-0 mix-blend-hard-light opacity-20 animate-slide-horizontal sepia"
              ></div>
            )}
            <div className="absolute top-0 left-0 translate-y-[-50%] translate-x-[-50%] bg-cyan-500 size-16 flex justify-center items-center font-black z-20 text-white text-4xl rounded-full">
              {points}
            </div>

            <figure className="h-full w-full max-w-[300px] mx-auto -mt-6 relative">
              <img
                src={iconSrc}
                alt="icon"
                className="border-4 w-full h-full rounded-[50%] object-contain bg-black"
              />
              <div className="absolute -bottom-2 left-0 right-0 p-2 flex justify-center items-center font-black text-black text-2xl rounded-full bg-input border-4">
                <span className="drop-shadow-xl text-str">
                  {currentCard.getType()}
                </span>
              </div>
              <div
                style={
                  {
                    background: color,
                  } as CSSProperties
                }
                className="absolute -bottom-8 left-0 right-0 mx-auto w-6 h-8 rounded-[50%] border shadow-inner"
              >
                <div className="absolute top-1 left-1 mx-auto w-1.5 h-2 bg-white/50 rounded-[50%]"></div>
              </div>
            </figure>
            <CardWrapper className="bg-secondary border-4 border-input w-full mt-auto">
              <CardHeader className=" rounded-t">
                <CardTitle className="flex items-center justify-between">
                  {game.getCurrentPlayer().getName()}, за теб се падна:
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <CardDescription dangerouslySetInnerHTML={{ __html: value }} />
              </CardContent>
              <CardFooter className="gap-4 justify-between  rounded-b">
                <Button
                  variant={'destructive'}
                  onClick={() => {
                    setGame((game) => {
                      game.dismissCard(false)
                      return game
                    })
                  }}
                >
                  Откажи
                </Button>
                <Button
                  onClick={() => {
                    setGame((game) => {
                      game.dismissCard(true)
                      return game
                    })
                  }}
                >
                  Направи
                </Button>
              </CardFooter>
            </CardWrapper>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
