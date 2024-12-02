import { ICard, ICardConstructorOptions } from '@/models/types'

export const pointsByRarity = new Map<
    ICardConstructorOptions['rarity'],
    number
>([
    ['COMMON', 1],
    ['RARE', 2],
    ['EPIC', 3],
    ['LEGENDARY', 5],
])
