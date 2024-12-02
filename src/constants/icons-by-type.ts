import { ICardConstructorOptions } from '@/models/types'
import { BeerIcon, LucideProps, SwordsIcon } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

export const iconsByType = new Map<ICardConstructorOptions['type'], string>([
  ['DARE', 'dare.svg'],
  ['DRINK', 'drink.svg'],
  ['NAUGHTY', 'naughty.svg'],
  ['TRUTH', 'truth.svg'],
])
