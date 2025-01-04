import { v4 } from 'uuid'
import { Card } from './card'
import { ActionType, CardRarity, ICard, IDeck, IDeckConstructor } from './types'
import _ from 'lodash'
import { probabilityByRarity } from '@/constants/probability-by-rarity'
import { NotFoundError } from '@/lib/errors'

export class Deck implements IDeck {
  #selectedCard: ICard | null
  #cards: ICard[]
  #drawn: ICard[]
  #undrawn: ICard[]
  constructor(options: IDeckConstructor) {
    if (!options.cards.length)
      throw new Error('A deck must have at least one card')
    this.#cards = options.cards
    this.#undrawn = this.#cards.filter(
      (c) => !options.drawnIds.includes(c.getId())
    )
    this.#drawn = this.#cards.filter((c) =>
      options.drawnIds.includes(c.getId())
    )
    this.#selectedCard =
      this.#cards.find((card) => card.getId() == options.selectedCardId) ?? null
  }

  resetDeck(): IDeck {
    this.#drawn = []
    this.#undrawn = this.#cards
    this.#selectedCard = null
    return this
  }
  getCards(): ICard[] {
    return this.#cards
  }

  addCards(cards: ICard): IDeck {
    this.#cards.push(cards)
    return this
  }

  drawCard(options?: { rarities?: CardRarity[]; types?: ActionType[] }): ICard {
    if (!this.#undrawn.length) {
      this.#undrawn = this.#cards
      this.#drawn = []
    }
    const cards = this.shuffle(
      this.#undrawn
        .filter((card) => {
          if (
            options?.rarities &&
            !options.rarities.includes(card.getRarity())
          ) {
            return false
          }

          if (options?.types && !options.types.includes(card.getType())) {
            return false
          }
          return true
        })
        .flatMap((card) => {
          const probability = probabilityByRarity.get(card.getRarity())
          return Array.from({ length: probability ?? 1 }).map(() => card)
        })
    )

    let card = _.sample(cards)

    if (!card) {
      // no cards with these rarities were found, must be reinserted back into deck

      this.#drawn = this.#drawn.filter((card) => {
        if (options?.rarities?.includes(card.getRarity())) {
          return false
        }
        if (options?.types?.includes(card.getType())) {
          return false
        }
        return true
      })
      this.#undrawn = this.#cards.filter((card) => {
        return !this.#drawn.some((c) => c.getId() == card.getId())
      })
      card = this.drawCard(options)
    }
    this.#drawn.push(card)
    this.#undrawn = this.#undrawn.filter((c) => c.getId() != card.getId())
    this.#selectedCard = card
    return card
  }

  getSelectedCard(): ICard | null {
    return this.#selectedCard
  }

  removeSelection(): IDeck {
    this.#selectedCard = null
    return this
  }

  getDrawnCards(): ICard[] {
    return this.#drawn
  }
  getUndrawnCards(): ICard[] {
    return this.#undrawn
  }
  removeCard(id: string): IDeck {
    this.#cards.filter((c) => c.getId() != id)
    this.#drawn.filter((c) => c.getId() != id)
    this.#undrawn.filter((c) => c.getId() != id)
    return this
  }
  shuffle(cards: ICard[]): ICard[] {
    const array = cards
    let currentIndex = array.length

    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }
    return array
  }

  toJSON() {
    return {
      selectedCardId: this.#selectedCard?.getId() ?? null,
      cards: this.#cards.map((c) => c.toJSON()),
      drawnIds: this.#drawn.map((c) => c.getId()),
    }
  }
}
