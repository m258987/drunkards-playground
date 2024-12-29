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
import { ICard } from '@/models/types'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { AlertDialogAction } from '@radix-ui/react-alert-dialog'

export const PickedCard = () => {
  const [game, setGame] = useGame()
  const currentCard = game.getCurrentCard()
  const currentPlayer = game.getCurrentPlayer()
  const id = currentCard?.getId()

  const randomPlayer = useMemo(() => {
    const result = _.sample(
      game
        .getActivePlayers()
        ?.filter((p) => p.getName() != game.getCurrentPlayer().getName())
    )
    console.log('Rerun of random player', result?.getName(), id)

    return result
  }, [id])
  console.log('randomPlayer', randomPlayer)

  const handlebarsTemplate = useMemo(
    () => ({
      randomPlayer: `<strong>${randomPlayer?.getName()}</strong>`,
    }),
    [randomPlayer]
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

  const author = useMemo(
    () => (currentCard ? currentCard.getAuthor() : undefined),
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

  const willBeDisqualified = useMemo(() => {
    return currentPlayer.getPoints() - (points ?? 0) < 0
  }, [points, currentPlayer])

  return (
    <>
      <Dialog open={!!game.getCurrentCard()}>
        <DialogContent
          id="card-preview"
          style={
            {
              '--bg': cardColor,
              '--border-color': color,
              perspective: '1000px',
            } as CSSProperties
          }
          NOX
          className="p-0 w-fit !rounded-3xl bg-transparent border-none shadow-none"
        >
          <CardBack color={cardColor} type={currentCard?.getType()} />
          <div
            style={{
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
            className="relative border-4 border-[var(--border-color)] !rounded-3xl p-4 w-[400px] h-[600px] flex flex-col bg-[var(--bg)]  z-10 !animate-spin-reveal"
          >
            <DialogTitle className="sr-only">Преглед на карта</DialogTitle>
            {currentCard != null && (
              <>
                {(currentCard.getRarity() == 'LEGENDARY' ||
                  currentCard.getRarity() == 'EPIC') && (
                  <>
                    <div
                      style={{ backgroundSize: '1000% 1000%' }}
                      className="absolute z-10 pointer-events-none bg-[url(/glint-2.jpg)] rounded-3xl inset-0 mix-blend-hard-light opacity-20 animate-slide-horizontal sepia"
                    ></div>
                  </>
                )}
                <div
                  style={{ backfaceVisibility: 'hidden' }}
                  className="absolute top-0 left-0 translate-y-[-50%] translate-x-[-50%] bg-cyan-500 size-16 flex justify-center items-center font-black z-20 text-white text-4xl rounded-full"
                >
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
                  <CardContent className="flex flex-col">
                    <CardDescription
                      className="text-black"
                      dangerouslySetInnerHTML={{ __html: value }}
                    />
                    {!!author && (
                      <cite className="text-right ml-auto text-xs">
                        - {author}
                      </cite>
                    )}
                  </CardContent>
                  <CardFooter className="gap-4 justify-between  rounded-b">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={'destructive'}>Откажи</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="w-fit max-w-[40rem]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Сигурен ли си, че искаш да откажеш картата?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                          {willBeDisqualified ? (
                            <>
                              Нямаш достатъчно точки, за да откажеш картата и да
                              продължиш. Отказвайки картата ще{' '}
                              <strong>oтпаднеш от играта</strong>.
                            </>
                          ) : (
                            <>
                              Отказвайки картата ще изгубиш{' '}
                              <strong>
                                {points} {`${points == 1 ? 'точка' : 'точки'}`}
                              </strong>{' '}
                              и ще останеш с{' '}
                              <strong>
                                {currentPlayer.getPoints() - (points ?? 0)}
                              </strong>
                              . Може да избереш "Предавам се", за да излезеш от
                              играта.
                            </>
                          )}
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogAction
                            asChild
                            onClick={() => {
                              setGame((game) => {
                                game.getCurrentPlayer().setState('DISQUALIFIED')
                                game.dismissCard(undefined)

                                return game
                              })
                            }}
                          >
                            <Button variant={'destructive'}>Предавам се</Button>
                          </AlertDialogAction>
                          <AlertDialogAction
                            asChild
                            onClick={() => {
                              setGame((game) => {
                                game.dismissCard(false)
                                return game
                              })
                            }}
                          >
                            <Button variant={'destructive'}>
                              Отказвам тази карта
                            </Button>
                          </AlertDialogAction>
                          <AlertDialogCancel>
                            Продължавам да играя
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

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
          </div>
        </DialogContent>
      </Dialog>

      <CardOpenAnimation currentCard={currentCard} />
    </>
  )
}

function CardBack(props: {
  color: string | undefined
  type: string | undefined
}) {
  return (
    <div className="absolute inset-0  !animate-spin-reveal">
      <div
        style={{
          backgroundColor: props.color,
          transform: 'rotateY(180deg)',
          // backfaceVisibility: 'hidden',
        }}
        id="card-back"
        className="bg-primary absolute inset-0 rounded-3xl duration-1000 animate-in fade-in zoom-in-75"
      >
        <img
          className="w-full h-full object-contain mix-blend-multiply absolute inset-0"
          src="/bayganyo.png"
        />
        <div className="absolute inset-0 flex items-center justify-center text-7xl font-black rotate-45 text-white">
          {props.type}
        </div>
      </div>
    </div>
  )
}

function CardOpenAnimation({ currentCard }: { currentCard: ICard | null }) {
  const source = useMemo(() => {
    if (!currentCard) return ''
    switch (currentCard.getRarity()) {
      case 'EPIC':
        return '/rare-shockwave.mp4'
      case 'LEGENDARY':
        return '/legendary-shockwave.mp4'
    }
  }, [currentCard])
  return (
    <Dialog open={!!currentCard} modal={false}>
      {currentCard != null &&
        (currentCard.getRarity() == 'EPIC' ||
          currentCard.getRarity() == 'LEGENDARY') && (
          <DialogContent
            NOX
            className="w-screen h-screen bg-transparent shadow-none min-w-[100vw] rounded-none border-none !pointer-events-none mix-blend-screen z-[999999]"
          >
            <DialogTitle className="sr-only">Picked card animation</DialogTitle>
            <video
              ref={(ref) => {
                if (ref) {
                  switch (currentCard.getRarity()) {
                    case 'EPIC':
                      ref.playbackRate = 2
                      break
                    case 'LEGENDARY':
                      ref.playbackRate = 2
                      break
                  }
                }
              }}
              muted
              playsInline
              autoPlay
              className="fixed w-screen h-screen inset-0 object-cover pointer-events-none  z-100"
            >
              <source src={source} />
            </video>
            <a
              href="https://www.vecteezy.com/free-videos/shock"
              className="absolute bottom-0 left-0 right-0 mx-auto text-center text-white"
            >
              Shock Stock Videos by Vecteezy
            </a>
          </DialogContent>
        )}
    </Dialog>
  )
}
