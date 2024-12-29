import { pointsByRarity } from '@/constants/points-by-rarity'
import { Card } from './card'
import {
  GameInnerState,
  GameJsonState,
  GameState,
  ICard,
  ICardConstructorOptions,
  IGame,
  IGameConstructorOptions,
  IPlayer,
  ITile,
} from './types'

import _ from 'lodash'
import { Player } from './player'
import { Tile } from './tile'
import { v4 } from 'uuid'
import { toast } from 'sonner'

export class Game implements IGame {
  #state: GameInnerState = {
    maxPoints: 35,
    id: v4(),
    state: 'PREGAME',
    players: [],
    tiles: [],
    cards: [],
    currentDiceValue: 0,
    currentPlayer: null,
    selectedCard: null,
    usedCards: [],
    history: [],
  }

  constructor(options: IGameConstructorOptions) {
    this.#state.state = 'PREGAME'
    this.#state.players = options.players
    this.#state.tiles = options.tiles
    this.#state.cards = options.cards
    this.#state.usedCards = []
  }
  getId(): string {
    return this.#state.id
  }
  getState(): GameState {
    return this.#state.state
  }
  getMaxPoints(): number {
    return this.#state.maxPoints
  }
  setMaxPoints(number: number): IGame {
    this.#state.maxPoints = number
    return this
  }
  pickNextPlayer(): IGame {
    const activePlayers = this.getActivePlayers()
    // if no active remain, the game is over
    if (!activePlayers.length || activePlayers.length == 1) {
      this.endGame()
      return this
    }
    // keep player the same if the dice is 6
    if (
      this.#state.currentDiceValue == 6 &&
      this.#state.currentPlayer?.getState() != 'DISQUALIFIED'
    ) {
      return this
    }
    // if there is no current player, pick the first from active
    if (!this.#state.currentPlayer) {
      this.#state.currentPlayer = activePlayers[0]
      return this
    }
    // get the next player or loop back to the first one
    const currentPlayerIndexInArray = this.#state.players.findIndex(
      (p) => p.getName() == this.#state.currentPlayer?.getName()
    )
    let iterration = 1
    let newPlayer: IPlayer | undefined = undefined
    do {
      const index =
        (currentPlayerIndexInArray + iterration) % this.#state.players.length
      if (this.#state.players[index].getState() == 'ACTIVE') {
        newPlayer = this.#state.players[index]
        break
      }
      iterration++
      if (iterration > this.#state.players.length) {
        break
      }
    } while (true)

    if (!newPlayer) {
      this.endGame()
    }
    this.#state.currentPlayer = newPlayer!
    return this
  }

  startGame(): IGame {
    if (this.#state.state == 'PLAYING') return this
    this.#state.currentPlayer = this.#state.players[0]
    this.#state.state = 'PLAYING'
    this.#state.players.forEach((p) => p.setTile(0))
    return this
  }
  endGame(): IGame {
    if (this.#state.state == 'END') return this
    this.#state.state = 'END'
    const sortedPlayers = this.#state.players
      .slice()
      .sort((a, b) => b.getPoints() - a.getPoints())
    console.log(sortedPlayers)
    // return the winners
    return this
  }
  restartGame(): IGame {
    if (this.#state.state == 'PREGAME') return this
    this.#state.state = 'PREGAME'
    this.#state.selectedCard = null
    this.#state.usedCards = []
    this.#state.history = []
    this.#state.players.forEach((p) => {
      p.setState('ACTIVE').setPoints(0).setTile(0)
    })
    this.#state.currentPlayer = this.#state.players[0]
    return this
  }

  getCurrentCard(): ICard | null {
    return this.#state.selectedCard
  }
  getPlayerLocation(player: IPlayer): ITile {
    const tile = this.#state.tiles.find(
      (tile) => tile.getIndex() == player.getTile()
    )
    if (!tile) {
      throw new Error('Player is off the board')
    }
    return tile as ITile
  }
  getCurrentPlayer(): IPlayer {
    return this.#state.currentPlayer as IPlayer
  }
  addPlayer(player: IPlayer): IGame {
    if (this.#state.players.find((p) => p.getName() == player.getName())) {
      throw new Error('Cannot add the same player twice')
    }
    this.#state.players.push(player)
    return this
  }
  addPlayers(players: IPlayer[]): IGame {
    players.forEach((player) => this.addPlayer(player))
    return this
  }
  removePlayer(player: IPlayer): IGame {
    this.#state.players.filter((p) => p.getName() != player.getName())
    return this
  }
  removePlayers(): IGame {
    this.#state.players = []
    return this
  }
  replacePlayers(players: IPlayer[]): IGame {
    const uniquePlayerNames = new Set<string>()
    players.forEach((p) => uniquePlayerNames.add(p.getName()))
    if (players.length != uniquePlayerNames.size) {
      throw new Error('Duplicate players are not allowed')
    }
    this.#state.players = players

    return this
  }
  getPlayers(): IPlayer[] {
    return this.#state.players
  }
  getActivePlayers(): IPlayer[] {
    return this.#state.players.slice().filter((p) => p.getState() == 'ACTIVE')
  }
  getTiles(): ITile[] {
    return this.#state.tiles
  }
  getActiveTiles(): ITile[] {
    const activePlayerTileIndexes = new Set<number>()
    this.getPlayers().forEach((player) =>
      activePlayerTileIndexes.add(player.getTile())
    )

    const activeTiles = this.getTiles().filter((tile) =>
      activePlayerTileIndexes.has(tile.getIndex())
    )
    return activeTiles
  }
  getTilePlayers(tileIndex: number, activeOnly?: boolean): IPlayer[] {
    const tile = this.#state.tiles?.[tileIndex]
    if (!tile) throw new Error('This tile does not exits')
    const players = activeOnly ? this.getActivePlayers() : this.getPlayers()
    const tilePlayers = players
      .slice()
      .filter((player) => player.getTile() == tile.getIndex())
    return tilePlayers
  }
  pickCard(tile: ITile): IGame {
    if (tile.getType() == 'START') {
      // add points for crossing the start
      this.#state.currentPlayer?.addPoints(1)
      toast('Тука няма карта, затова взимаш 1 точка.')
      return this
    }
    const type = tile.getType()
    const rarities = tile.getAllowedRarities()
    const cardsOfType = this.#state.cards.filter(
      (card) => card.getType() == type && rarities.includes(card.getRarity())
    )
    const card = _.sample(cardsOfType)
    if (typeof card == 'undefined') {
      // handle this or end game?
      console.error(type, rarities)
      throw new Error('No cards of this type left', {
        cause: { type, rarities },
      })
    }
    this.#state.selectedCard = card as ICard
    return this
  }
  dismissCard(success: boolean | undefined): IGame {
    if (typeof success == undefined) {
      this.#state.selectedCard = null
    }
    if (!this.#state.selectedCard) {
      this.pickNextPlayer()
      return this
    }
    if (!this.#state.currentPlayer) {
      this.pickNextPlayer()
      return this
    }
    this.#state.usedCards.push(this.#state.selectedCard as ICard)
    const rarity = this.#state.selectedCard.getRarity()
    const points = pointsByRarity.get(rarity)
    if (!points) {
      return this
    }
    if (success) {
      this.#state.currentPlayer?.addPoints(points)
      this.putHistory({
        action: `Прие карта и спечели ${
          pointsByRarity.get(this.#state.selectedCard.getRarity()) ?? ''
        } точки`,
        card: this.getCurrentCard() ?? undefined,
        player: this.getCurrentPlayer(),
      })
      if (this.#state.currentPlayer.getPoints() >= this.#state.maxPoints) {
        this.putHistory({
          action: 'Won',
          player: this.getCurrentPlayer(),
        })
        this.endGame()
        return this
      }
    } else {
      this.#state.currentPlayer?.addPoints(-1 * points)
      const currentPoints = this.#state.currentPlayer.getPoints()
      this.putHistory({
        action: `Отказа карта и загуби ${
          pointsByRarity.get(this.#state.selectedCard.getRarity()) ?? ''
        } точки`,
        card: this.getCurrentCard() ?? undefined,
        player: this.getCurrentPlayer(),
      })
      if (currentPoints < 0) {
        this.#state.currentPlayer.setState('DISQUALIFIED')
        this.putHistory({
          action: 'Дисквалифициран',
          player: this.getCurrentPlayer(),
        })
      }
    }
    this.#state.selectedCard = null
    this.pickNextPlayer()
    return this
  }
  moveCurrentPlayerBy(steps: number): IGame {
    if (!this.#state.currentPlayer) return this
    const currentPlayerTile = this.#state.currentPlayer?.getTile()
    const nextTile = currentPlayerTile + steps
    const tileIndex = nextTile % this.#state.tiles.length
    this.setPlayerLocation(this.#state.currentPlayer, tileIndex)

    return this
  }
  setPlayerLocation(player: IPlayer, index: number): IGame {
    player.setTile(index)
    return this
  }

  rollDice(): IGame {
    const array = [1, 2, 3, 4, 5, 6]
    const value = _.sample(array) as number
    this.#state.currentDiceValue = value
    // this.moveCurrentPlayerBy(value)

    return this
  }
  getDice(): number {
    return this.#state.currentDiceValue
  }

  // restore area
  toJSON(): GameJsonState {
    return {
      ...this.#state,
      cards: this.#state.cards.map((card) => card.toJSON()),
      players: this.#state.players.map((player) => player.toJSON()),
      tiles: this.#state.tiles.map((tile) => tile.toJSON()),
      currentPlayer: this.#state.currentPlayer?.toJSON() ?? null,
      selectedCard: this.#state.selectedCard?.toJSON() ?? null,
      history: this.historyToJSON(),
    }
  }
  restoreGame(options: GameJsonState): IGame {
    const cards = options.cards.map((card) => new Card(card))
    const players = options.players.map(
      (player) => new Player(player.name, player)
    )
    const tiles = options.tiles.map(
      (tile) => new Tile(tile.index, tile.type, tile.rarities)
    )
    const currentPlayer = options.currentPlayer
      ? players.find((p) => p.getName() == options.currentPlayer?.name) ?? null
      : null
    const selectedCard = options.selectedCard
      ? cards.find((c) => c.getId() == options.selectedCard?.id) ?? null
      : null

    this.#state = {
      ...options,
      selectedCard,
      currentPlayer,
      usedCards: [],
      cards,
      players,
      tiles,
      history:
        options.history?.map((h) => {
          const card = cards.find((c) => c.getId() == h.cardId)
          const player = players.find((p) => p.getName() == h.playerName)

          return {
            card,
            createdAt: h.createdAt,
            id: h.id,
            player,
            action: h.action,
          }
        }) ?? [],
    }

    return this
  }

  // history
  getHistory(): GameInnerState['history'] {
    return this.#state.history
  }

  clearHistory(): IGame {
    this.#state.history = []
    return this
  }

  deleteHistory(id: string): IGame {
    this.#state.history = this.#state.history.filter((entry) => entry.id != id)
    return this
  }

  getLatestHistory(): GameInnerState['history'][number] | undefined {
    return this.#state.history?.[0]
  }

  putHistory(input: Partial<GameInnerState['history'][number]>): IGame {
    const found = this.getHistory().find((entry) => entry.id == input.id)
    if (!input.action || found?.action) {
      throw new Error('Cannot have history without aciton')
    }
    const entry: GameInnerState['history'][number] = {
      id: input.id ?? found?.id ?? v4(),
      action: input.action ?? found?.action,
      createdAt: input.createdAt ?? found?.createdAt ?? Date.now(),
      card: input?.card ?? found?.card ?? undefined,
      player: input?.player ?? found?.player ?? undefined,
    }
    if (found) {
      const index = this.#state.history.findIndex((item) => item.id == found.id)
      this.#state.history = [
        ...this.#state.history.slice(0, index),
        entry,
        ...this.#state.history.slice(index + 1),
      ]

      return this
    }
    this.#state.history.unshift(entry)
    return this
  }
  updateLatestHistory(input: GameInnerState['history'][number]): IGame {
    if (!this.getLatestHistory()) return this
    this.#state.history[0] = input
    return this
  }

  historyToJSON(): GameJsonState['history'] {
    return (
      this.#state.history.map((h) => ({
        id: h.id,
        cardId: h.card?.getId(),
        playerName: h.player?.getName(),
        createdAt: h.createdAt,
        action: h.action,
      })) ?? []
    )
  }
}
