// todo make everyting a zod schema?

export type GameState = 'PREGAME' | 'PLAYING' | 'END'

export interface IGameConstructorOptions {
  players: IPlayer[]
  tiles: ITile[]
  cards: ICard[]
}

export type GameInnerState = {
  id: string
  state: GameState
  players: IPlayer[]
  tiles: ITile[]
  cards: ICard[]
  usedCards: ICard[]
  selectedCard: ICard | null
  currentPlayer: IPlayer | null
  currentDiceValue: number
  maxPoints: number
  history: {
    id: string
    action: string
    card?: ICard
    player?: IPlayer
    createdAt: number
  }[]
}

export type GameJsonState = Omit<
  GameInnerState,
  'players' | 'cards' | 'tiles' | 'currentPlayer' | 'selectedCard' | 'history'
> & {
  tiles: TileInnerState[]
  players: PlayerInnerState[]
  cards: CardInnerState[]
  currentPlayer: PlayerInnerState | null
  selectedCard: CardInnerState | null
  history: {
    id: string
    cardId?: string
    action: string
    playerName?: string
    createdAt: number
  }[]
}

// keep somehow in state? Or use React class comp?
export interface IGame {
  //  methods
  getId(): string
  getState(): GameState
  getMaxPoints(): number
  setMaxPoints(number: number): IGame
  addPlayer(player: IPlayer): IGame
  addPlayers(players: IPlayer[]): IGame
  removePlayer(player: IPlayer): IGame
  removePlayers(): IGame
  replacePlayers(players: IPlayer[]): IGame
  getPlayers(): IPlayer[]
  getActivePlayers(): IPlayer[]
  getTiles(): ITile[]
  getActiveTiles(): ITile[]
  getPlayerLocation(player: IPlayer): ITile
  getTilePlayers(tileIndex: number, activeOnly?: boolean): IPlayer[]
  getCurrentCard(): ICard | null
  getCurrentPlayer(): IPlayer
  // game actions
  pickNextPlayer(): IGame
  pickCard(tile: ITile): IGame
  dismissCard(success: boolean | undefined): IGame
  rollDice(): IGame
  moveCurrentPlayerBy(steps: number): IGame
  setPlayerLocation(player: IPlayer, index: number): IGame
  getDice(): number
  restartGame(): IGame
  startGame(): IGame
  endGame(): IGame

  // restore the game from localstorage
  restoreGame(options: GameJsonState): IGame
  toJSON(): GameJsonState

  // history
  getLatestHistory(): GameInnerState['history'][number] | undefined
  putHistory(input: Partial<GameInnerState['history'][number]>): IGame
  updateLatestHistory(input: GameInnerState['history'][number]): IGame
  deleteHistory(id: string): IGame
  clearHistory(): IGame
  getHistory(): GameInnerState['history']
  historyToJSON(): GameJsonState['history']
}

export type TileType = ActionType | 'NAUGHTY' | 'START'

export type TileInnerState = {
  index: number
  type: TileType
  rarities: [CardRarity, ...CardRarity[]]
}

export interface ITile {
  // methods
  getType(): TileType
  getIndex(): number
  getAllowedRarities(): [CardRarity, ...CardRarity[]]
  toJSON(): TileInnerState
}

export type PlayerState = 'ACTIVE' | 'DISQUALIFIED'
export type PlayerHistory = { name: string }

export type PlayerInnerState = {
  color: string
  name: string
  tile: number
  history: PlayerHistory[]
  points: number
  state: PlayerState
}

export interface IPlayer {
  setTile(tileIndex: number): IPlayer
  setState(state: PlayerState): IPlayer
  addHistory(event: PlayerHistory): IPlayer
  // mandatory
  getName(): string
  getState(): PlayerState
  getTile(): number
  getPoints(): number
  setPoints(number: number): IPlayer
  addPoints(number: number): IPlayer
  toJSON(): PlayerInnerState
}

export type ActionType = 'DRINK' | 'DARE' | 'TRUTH' | 'NAUGHTY'
export type CardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

export interface ICardConstructorOptions {
  id: string
  type: ActionType
  // use legendary only on special fields
  rarity: CardRarity
  value: string
  author?: string
}

export type CardInnerState = {
  id: string
  type: ActionType
  rarity: CardRarity
  value: string
  author?: string
}

export interface ICard {
  // methods
  getValue(): string
  getRarity(): CardRarity
  getType(): ActionType
  getId(): string
  getAuthor(): string | undefined
  toJSON(): ICardConstructorOptions
}

export interface IDeckConstructor {
  cards: Array<Omit<ICardConstructorOptions, 'id'> & { count: number }>
}

export interface IDeck {
  getCards(): ICard[]
}
