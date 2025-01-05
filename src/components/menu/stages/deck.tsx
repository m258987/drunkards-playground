import React, { useCallback, useState } from 'react'
import { useMenu } from '../menu-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import moment from 'moment'
import { DEFAULT_DECK } from '@/constants/_default-deck'
import { v4 } from 'uuid'

type Props = {}

const MenuDecks = (props: Props) => {
  const router = useRouter()
  const { decks, setStage, actions } = useMenu()
  const [selected, setSelected] = useState<(typeof decks)[number] | null>(null)

  const handleBack = useCallback(() => {
    setStage('main')
  }, [setStage])

  const handleSelect = useCallback(() => {
    if (selected) {
      // setDeck(selected.save)
      router.push('/game')
    }
  }, [selected])

  const handleLoadDefaultDeck = useCallback(() => {
    actions.loadDeck({
      id: v4(),
      createdAt: Date.now(),
      name: 'Default Deck',
      deck: DEFAULT_DECK.toJSON(),
    })
  }, [actions])

  return (
    <div className="max-w-[250px] mx-auto pt-10">
      <h1 className="text-xl font-bold mb-5">
        <Button
          onClick={handleBack}
          variant={'ghost'}
          size={'icon'}
          title="Назад"
        >
          <ChevronLeft />
        </Button>
        Декове
      </h1>
      <Button onClick={handleLoadDefaultDeck}>
        Зареди тесте по подразбиране.
      </Button>
      <ul className="flex flex-col space-y-4">
        {decks.map((deck) => {
          const isSelected = selected?.id == deck.id
          return (
            <li data-selected={isSelected} key={deck.id}>
              <Button
                variant={isSelected ? 'default' : 'outline'}
                className="flex flex-col justify-start items-start text-left h-auto w-full rounded-2xl"
                onClick={() => setSelected(deck)}
              >
                <h3>{deck.name}</h3>
                <time>
                  {moment(deck.createdAt).format('DD MMM YYYY; HH:mm')}
                </time>
              </Button>
            </li>
          )
        })}
      </ul>
      <footer className="flex items-center fixed bottom-2 left-0 right-0 mx-auto max-w-[250px]">
        <Button
          onClick={handleSelect}
          size={'lg'}
          className="w-full"
          disabled={!selected}
        >
          Зареди
        </Button>
      </footer>
    </div>
  )
}

export default MenuDecks
