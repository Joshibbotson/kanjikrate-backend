import { Inject, Injectable } from '@nestjs/common';
import { CommonService } from 'src/features/common/common.service';
import { Deck, DeckDocument } from './deck.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateDeckDto, IReadDeck, IDefaultDecks } from './deck.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CardService } from '../card/card.service';

@Injectable()
export class DeckService extends CommonService<
  CreateDeckDto,
  IReadDeck,
  DeckDocument
> {
  private readonly hiraganaDeck = {
    name: 'Hiragana Deck',
    description: 'A default Hiragana Deck',
    __v: 0,
  };

  private readonly katakanaDeck = {
    name: 'Katakana Deck',
    description: 'A default Katakana Deck',
    __v: 0,
  };

  private readonly romajiDeck = {
    name: 'Romaji Deck',
    description: 'A default Romaji Deck',
    __v: 0,
  };
  constructor(
    @InjectModel(Deck.name) deckModel: Model<DeckDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    private readonly _cardService: CardService,
  ) {
    super(deckModel, cacheManager);
  }

  public async createDefaultDecks(userId: Types.ObjectId) {
    const defaultDecks = {
      hiraganaDeck: {
        ...this.hiraganaDeck,
        owner: userId,
      },
      katakanaDeck: {
        ...this.katakanaDeck,
        owner: userId,
      },
      romajiDeck: {
        ...this.romajiDeck,
        owner: userId,
      },
    };

    const createdHiraganaDeck = await this.create(defaultDecks.hiraganaDeck);
    const createdKatakanaDeck = await this.create(defaultDecks.katakanaDeck);
    const createdRomajiDeck = await this.create(defaultDecks.romajiDeck);

    const createdDecks: IDefaultDecks = {
      hiraganaDeck: new Types.ObjectId(createdHiraganaDeck._id),
      katakanaDeck: new Types.ObjectId(createdKatakanaDeck._id),
      romajiDeck: new Types.ObjectId(createdRomajiDeck._id),
    };
    const { hiraganaCards, katakanaCards, romajiCards } =
      await this._cardService.createDefaultCards(createdDecks);

    await Promise.all([
      this.update(createdDecks.hiraganaDeck._id, { cards: hiraganaCards }),
      this.update(createdDecks.katakanaDeck, { cards: katakanaCards }),
      this.update(createdDecks.romajiDeck, { cards: romajiCards }),
    ]);
  }
}
