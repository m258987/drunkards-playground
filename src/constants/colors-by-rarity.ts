import { ICardConstructorOptions } from '@/models/types'

export const colorsByRarity = new Map<
  ICardConstructorOptions['rarity'],
  string
>([
  ['COMMON', 'gray'],
  ['RARE', 'blue'],
  ['EPIC', 'purple'],
  ['LEGENDARY', 'orange'],
])
