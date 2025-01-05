import React, { useCallback, useEffect, useState } from 'react'
import { useMenu } from '../menu-provider'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

type Props = {}

const MenuLoadGame = (props: Props) => {
  const router = useRouter()
  const { saves, setGame, setStage } = useMenu()
  const [selected, setSelected] = useState<(typeof saves)[number] | null>(null)

  const handleBack = useCallback(() => {
    setStage('main')
  }, [setStage])

  const handleSelect = useCallback(() => {
    if (selected) {
      setGame(selected.save)
      router.push('/game')
    }
  }, [selected])

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
        Зареди игра
      </h1>
      <ul className="flex flex-col space-y-4">
        {saves.map((save) => {
          const isSelected = selected?.id == save.id
          return (
            <li data-selected={isSelected} key={save.id}>
              <Button
                variant={isSelected ? 'default' : 'outline'}
                className="flex flex-col justify-start items-start text-left h-auto w-full rounded-2xl"
                onClick={() => setSelected(save)}
              >
                <h3>{save.name}</h3>
                <time>
                  {moment(save.updatedAt).format('DD MMM YYYY; HH:mm')}
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

export default MenuLoadGame
