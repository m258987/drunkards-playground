'use client'

import { useMemo } from 'react'
import { Logo } from '../../logo/logo'
import { Button } from '../../ui/button'
import { useMenu } from '../menu-provider'

type Props = {}

const MainMenu = (props: Props) => {
  const { game, saves, actions } = useMenu()

  const continueDisabled = useMemo(() => !game, [game])

  console.log('main menu', game, !game)

  return (
    <div className="fixed inset-0 overflow-y-auto flex flex-col items-center justify-center h-full flex-grow">
      <img className="max-w-[250px]" src="/bayganyo.png" alt="Drunkard" />
      <Logo className="max-w-[250px] h-fit  w-full text-primary" />
      <ul className="flex flex-col space-y-4 [&>li]:w-full [&>li>button]:w-full w-full max-w-[250px] mt-6">
        <li>
          <Button
            suppressHydrationWarning
            disabled={continueDisabled}
            onClick={actions.continue}
          >
            Продължи игра
          </Button>
        </li>
        <li>
          <Button onClick={actions.newGame}>Нова игра</Button>
        </li>

        <li>
          <Button disabled={!saves.length} onClick={actions.loadGameList}>
            Зареди игра
          </Button>
        </li>
        <li>
          <Button onClick={actions.loadDecksList}>Декове</Button>
        </li>
        <li>
          <Button>Настройки</Button>
        </li>
      </ul>
    </div>
  )
}

export default MainMenu
