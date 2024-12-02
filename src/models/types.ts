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
}

export type GameJsonState = Omit<
  GameInnerState,
  'players' | 'cards' | 'tiles' | 'currentPlayer' | 'selectedCard'
> & {
  tiles: TileInnerState[]
  players: PlayerInnerState[]
  cards: CardInnerState[]
  currentPlayer: PlayerInnerState | null
  selectedCard: CardInnerState | null
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
  getTilePlayers(tileIndex: number): IPlayer[]
  getCurrentCard(): ICard | null
  getCurrentPlayer(): IPlayer
  // game actions
  pickNextPlayer(): IGame
  pickCard(tile: ITile): IGame
  dismissCard(success: boolean): IGame
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
}

export type CardInnerState = {
  id: string
  type: ActionType
  rarity: CardRarity
  value: string
}

export interface ICard {
  // methods
  getValue(): string
  getRarity(): CardRarity
  getType(): ActionType
  getId(): string
  toJSON(): ICardConstructorOptions
}

export interface IDeckConstructor {
  cards: Array<Omit<ICardConstructorOptions, 'id'> & { count: number }>
}

export interface IDeck {
  getCards(): ICard[]
}
