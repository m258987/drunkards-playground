import { CardRarity, IPlayer, ITile, TileInnerState, TileType } from './types'

export class Tile implements ITile {
  #state: TileInnerState = {
    index: 0,
    type: 'TRUTH',
    rarities: ['COMMON'],
  }

  constructor(
    index: number,
    type: TileType,
    rarities: [CardRarity, ...CardRarity[]] = ['COMMON']
  ) {
    this.#state.index = index
    this.#state.type = type
    this.#state.rarities = rarities
  }

  public getType() {
    return this.#state.type
  }
  public getIndex() {
    return this.#state.index
  }
  public getAllowedRarities() {
    return this.#state.rarities
  }
  public toJSON(): {
    index: number
    type: TileType
    rarities: [CardRarity, ...CardRarity[]]
  } {
    return this.#state
  }
}
