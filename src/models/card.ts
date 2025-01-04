import { v4 } from 'uuid'
import {
  ActionType,
  CardInnerState,
  CardRarity,
  ICard,
  ICardConstructorOptions,
} from './types'

export class Card implements ICard {
  #state: CardInnerState

  constructor(options: ICardConstructorOptions) {
    this.#state = {} as CardInnerState
    this.#state.points = options.points ?? 1
    this.#state.id = options.id ?? v4()
    this.#state.rarity = options.rarity
    this.#state.type = options.type
    this.#state.value = options.value
    this.#state.author = options.author
  }
  getId(): string {
    return this.#state.id
  }
  getRarity(): CardRarity {
    return this.#state.rarity
  }
  getType(): ActionType {
    return this.#state.type
  }
  getValue(): string {
    return this.#state.value
  }
  getAuthor(): string | undefined {
    return this.#state.author
  }
  duplicate(): ICard {
    return new Card({ ...this.#state, id: v4() })
  }
  getPoints(): number {
    return this.#state.points
  }
  toJSON(): ICardConstructorOptions {
    return {
      id: this.#state.id,
      type: this.#state.type,
      rarity: this.#state.rarity,
      value: this.#state.value,
      points: this.#state.points,
      author: this.#state.author,
    }
  }
}
