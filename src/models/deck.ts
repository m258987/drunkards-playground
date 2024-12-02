import { v4 } from "uuid";
import { Card } from "./card";
import { ICard, IDeck, IDeckConstructor } from "./types";

export class Deck implements IDeck {
    #cards:ICard[]
    constructor(options: IDeckConstructor) {
        this.#cards = options.cards.flatMap((card) => {
            return Array.from({ length: card.count }).map((_,i) => {
                return new Card({...card,id:v4()})
            })
        })
    }
    getCards(): ICard[] {
        return this.#cards
    }
}