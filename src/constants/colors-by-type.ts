import { ICardConstructorOptions } from '@/models/types'

export const colorsByType = new Map<ICardConstructorOptions['type'], string>([
  ['DARE', 'rebeccapurple'],
  ['DRINK', 'tomato'],
  ['NAUGHTY', 'darkgray'],
  ['TRUTH', 'lightgreen'],
])
