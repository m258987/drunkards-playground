'use client'

import { DEFAULT_DECK } from '@/constants/_default-deck'
import { getGameVersion } from '@/lib/get-game-version'
import { Card } from '@/models/card'
import { DeckJSONState, GameJsonState, IGame } from '@/models/types'
import { useRouter } from 'next/navigation'
import React, {
  createContext,
  ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'
import { useLocalStorage } from 'usehooks-ts'
import Menu from './menu'
import { Deck } from '@/models/deck'
import { v4 } from 'uuid'

type LocalStorageSave = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  save: GameJsonState
}

type LocalStorageDeck = {
  id: string
  name: string
  createdAt: number
  deck: DeckJSONState
}

type MenuSettings = {}

interface IMenu {
  stage: 'main' | 'settings' | 'deck' | 'load-game'
  setStage: React.Dispatch<React.SetStateAction<IMenu['stage']>>
  game: GameJsonState | null
  setGame: React.Dispatch<React.SetStateAction<GameJsonState | null>>
  deck: DeckJSONState
  decks: LocalStorageDeck[]
  saves: LocalStorageSave[]
  setSaves: React.Dispatch<React.SetStateAction<LocalStorageSave[]>>
  settings: MenuSettings
  actions: {
    updateSave: (id: string, name: string, game: GameJsonState) => void
    continue: () => void
    newGame: () => void
    loadSettings: () => void
    loadGameList: () => void
    loadGame: (save: LocalStorageSave) => void
    loadDecksList: () => void
    loadDeck: (deck: LocalStorageDeck) => void
    upsertDeck: (deck: LocalStorageDeck) => void
    deleteDeck: (id: string) => void
    exportDeckCSV: (deck: LocalStorageDeck) => void
    importDeckCSV: (string: string) => Promise<void>
  }
}

const MenuContext = createContext<IMenu>(undefined!)

type Props = {
  children: ReactNode
}

const MenuProvider = (props: Props) => {
  const router = useRouter()
  const [settings, setSettings, removeSettings] = useLocalStorage<MenuSettings>(
    `settings@${getGameVersion()}`,
    {},
    { initializeWithValue: false }
  )
  const [saves, setSaves, removeSaves] = useLocalStorage<LocalStorageSave[]>(
    `saves@${getGameVersion()}`,
    [],
    { initializeWithValue: false }
  )

  const sortedSaves = useMemo(
    () => saves.sort((a, b) => b.updatedAt - a.updatedAt),
    [saves]
  )

  const [game, setGame, removeGame] = useLocalStorage<GameJsonState | null>(
    `game@${getGameVersion()}`,
    null,
    { initializeWithValue: false }
  )

  const [deck, setDeck, removeDeck] = useLocalStorage<DeckJSONState>(
    `deck@${getGameVersion()}`,
    DEFAULT_DECK.toJSON(),
    { initializeWithValue: false }
  )

  const [decks, setDecks, removeDecks] = useLocalStorage<LocalStorageDeck[]>(
    `decks@${getGameVersion()}`,
    [],
    { initializeWithValue: false }
  )

  useEffect(() => {
    router.prefetch('/game')
  }, [])

  console.log('local', game)

  const [stage, setStage] = useState<IMenu['stage']>('main')

  const continueAction: IMenu['actions']['continue'] = useCallback(() => {
    if (!game) {
      toast.error('No game to continue')
      return
    }
    router.push('/game')
  }, [game])

  const newGameAction: IMenu['actions']['newGame'] = useCallback(() => {
    removeGame()
    router.push('/game')
  }, [])

  const loadGameListAction: IMenu['actions']['loadGameList'] =
    useCallback(() => {
      if (!saves.length) {
        toast.error('No saves to load')
        return
      }
      setStage('load-game')
    }, [saves])

  const loadDecksListAction: IMenu['actions']['loadDecksList'] =
    useCallback(() => {
      setStage('deck')
    }, [decks])

  const loadDeckAction: IMenu['actions']['loadDeck'] = useCallback((deck) => {
    setDeck(deck.deck)
  }, [])

  const exportDeckAction: IMenu['actions']['exportDeckCSV'] = useCallback(
    (deck) => {
      try {
        const raw = JSON.stringify(deck)
        const blob = new Blob([raw], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `deck.${deck.name}@${getGameVersion()}.json`
        link.href = url
        link.click()
        link.remove()
      } catch (e) {
        toast.error('Could not stringify deck')
      }
    },
    [decks]
  )

  const importDeckAction: IMenu['actions']['importDeckCSV'] = useCallback(
    async (string: string) => {
      try {
        // todo zod parsing
        const parsed = JSON.parse(string) as LocalStorageDeck
        const newDeck = new Deck({
          ...parsed.deck,
          cards: parsed.deck.cards.map((c) => new Card(c)),
        })
        setDecks((ps) => {
          return [...ps, { ...parsed, deck: newDeck.toJSON() }]
        })
      } catch (e) {
        toast.error('Could not parse state')
      }
    },
    [decks]
  )

  const loadGameAction = useCallback((save: LocalStorageSave) => {
    setGame(save.save)
    router.push('/game')
  }, [])

  const upsertDeckAction = useCallback(
    (newDeck: LocalStorageDeck) => {
      setDecks((ps) => {
        const indexOf = ps.findIndex((deck) => deck.id == newDeck.id)
        if (indexOf > -1) {
          return [...ps.splice(indexOf, 1, newDeck)]
        }
        return [...ps, newDeck]
      })
      if (deck && deck.id == newDeck.id) {
        setDeck(newDeck.deck)
      }
    },
    [deck, decks]
  )

  const deleteDeckAction = useCallback(
    (id: string) => {
      setDecks((ps) => {
        return ps.filter((deck) => deck.id != id)
      })
      if (deck.id == id) {
        removeDeck()
      }
    },
    [deck, decks]
  )

  const loadSettingsAction = useCallback(() => {
    setStage('settings')
  }, [settings])

  const updateSaveAction: IMenu['actions']['updateSave'] = useCallback(
    (id, name, game) => {
      setSaves((ps) => {
        const indexOf = ps.findIndex((save) => save.id == id)
        console.log('INdexof', indexOf, id)

        if (indexOf != -1) {
          const item = ps[indexOf]
          return [
            ...ps.slice(0, indexOf),
            {
              ...item,
              updatedAt: Date.now(),
              save: game,
              name,
            },
            ...ps.slice(indexOf + 1),
          ]
          return ps.splice(indexOf, 1, {
            ...item,
            updatedAt: Date.now(),
            save: game,
            name,
          })
        }
        return [
          ...ps,
          {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            id: id,
            save: game,
            name,
          },
        ]
      })
    },
    [saves, setSaves]
  )

  return (
    <MenuContext.Provider
      value={{
        game,
        setGame,
        saves: sortedSaves,
        setSaves,
        setStage,
        stage,
        deck,
        decks,
        settings,
        actions: {
          continue: continueAction,
          newGame: newGameAction,
          loadGameList: loadGameListAction,
          loadGame: loadGameAction,
          loadDecksList: loadDecksListAction,
          loadDeck: loadDeckAction,
          upsertDeck: upsertDeckAction,
          deleteDeck: deleteDeckAction,
          exportDeckCSV: exportDeckAction,
          importDeckCSV: importDeckAction,
          loadSettings: loadSettingsAction,
          updateSave: updateSaveAction,
        },
      }}
    >
      {props.children}
    </MenuContext.Provider>
  )
}

export default MenuProvider

export const useMenu = () => {
  const context = use(MenuContext)
  if (!context) {
    throw new Error('Menu Context must be used inside Menu Provider')
  }
  return context
}
