'use client'

import React from 'react'
import { Logo } from '../logo/logo'
import { Button } from '../ui/button'
import { useLocalStorage } from 'usehooks-ts'
import { GameJsonState } from '@/models/types'
import { getGameVersion } from '@/lib/get-game-version'
import { useMenu } from './menu-provider'
import MainMenu from './stages/main-menu'
import MenuOptions from './stages/options'
import MenuDecks from './stages/deck'
import MenuLoadGame from './stages/load-game'

type Props = {}

const Menu = (props: Props) => {
  const { stage } = useMenu()

  switch (stage) {
    case 'main':
      return <MainMenu />
    case 'settings':
      return <MenuOptions />
    case 'deck':
      return <MenuDecks />
    case 'load-game':
      return <MenuLoadGame />
    default:
      return <MainMenu />
  }
}

export default Menu
