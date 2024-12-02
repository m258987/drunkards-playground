import { predefinedColors } from '@/constants/predefined-colors'
import { IPlayer, PlayerHistory, PlayerInnerState, PlayerState } from './types'

export class Player implements IPlayer {
  // todo move everything to state
  #state: PlayerInnerState = {
    name: '',
    tile: 0,
    points: 0,
    history: [],
    state: 'ACTIVE',
    color: 'blue',
  }

  constructor(name: string, options?: Partial<PlayerInnerState>) {
    this.#state.name = name
    this.#state.tile = options?.tile ?? 0
    this.#state.points = options?.points ?? 0
    this.#state.state = options?.state ?? 'ACTIVE'
    this.#state.color = options?.color ?? predefinedColors[0]
  }

  getPoints(): number {
    return this.#state.points
  }
  setPoints(number: number): IPlayer {
    this.#state.points = number
    return this
  }
  addPoints(number: number): IPlayer {
    this.#state.points += number
    return this
  }
  addHistory(event: PlayerHistory): IPlayer {
    this.#state.history.push(event)
    return this
  }
  setTile(tileIndex: number): IPlayer {
    this.#state.tile = tileIndex
    return this
  }
  setState(state: PlayerState): IPlayer {
    this.#state.state = state
    return this
  }
  getName() {
    return this.#state.name
  }
  getState() {
    return this.#state.state
  }
  getTile() {
    return this.#state.tile
  }
  toJSON(): PlayerInnerState {
    return this.#state
  }
}
