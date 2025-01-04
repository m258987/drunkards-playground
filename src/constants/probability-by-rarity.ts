import { ICardConstructorOptions } from '@/models/types'

export const probabilityByRarity = new Map<
  ICardConstructorOptions['rarity'],
  number
>([
  ['COMMON', 60],
  ['UNCOMMON', 25],
  ['RARE', 10],
  ['EPIC', 4],
  ['LEGENDARY', 1],
])
