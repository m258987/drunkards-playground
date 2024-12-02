import { CardRarity, ITile, TileType } from '@/models/types'
type TileListType = {
  type: TileType
  rarities: [CardRarity, ...CardRarity[]]
}[]
export const tiles: TileListType = [
  //top
  { type: 'START', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE'] },
  // Super date
  { type: 'DARE', rarities: ['LEGENDARY'] },
  //right
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'NAUGHTY', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  // Super drink
  { type: 'DRINK', rarities: ['LEGENDARY'] },
  // bottom
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['EPIC', 'RARE', 'LEGENDARY'] },
  // Super truth
  { type: 'TRUTH', rarities: ['LEGENDARY'] },
  // left
  { type: 'NAUGHTY', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DRINK', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'TRUTH', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
  { type: 'DARE', rarities: ['COMMON', 'EPIC', 'RARE', 'LEGENDARY'] },
]
