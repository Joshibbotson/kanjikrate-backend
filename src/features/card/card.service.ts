import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/features/common/common.service';
import { Card, CardDocument } from './card.schema';
import { Model, Types } from 'mongoose';
import { CreateCardDto, IReadCard } from './card.types';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { defaultCardOpts } from './card.data';
import { IDefaultDecks } from '../deck/deck.types';
import { IReadManyAndCount } from '../common/common.types';

@Injectable()
export class CardService extends CommonService<
  CreateCardDto,
  IReadCard,
  IReadManyAndCount<IReadCard>,
  CardDocument
> {
  constructor(
    @InjectModel(Card.name) public readonly cardModel: Model<CardDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cardModel, cacheManager);
  }

  public async createDefaultCards(defaultDeckIds: IDefaultDecks) {
    const mappedHiraganaCards = defaultCardOpts.hiraganaCards.map((card) => {
      return { ...card, deck: defaultDeckIds.hiraganaDeck };
    });

    const mappedKatakanaCards = defaultCardOpts.katakanaCards.map((card) => {
      return { ...card, deck: defaultDeckIds.katakanaDeck };
    });

    const mappedRomajiCards = defaultCardOpts.romajiCards.map((card) => {
      return { ...card, deck: defaultDeckIds.romajiDeck };
    });

    const createdHiraganaCards = await this.createMany(mappedHiraganaCards);
    const createdKatakanaCards = await this.createMany(mappedKatakanaCards);
    const createdRomajiCards = await this.createMany(mappedRomajiCards);

    const createdCards = {
      hiraganaCards: createdHiraganaCards.map(
        (card) => new Types.ObjectId(card._id),
      ),
      katakanaCards: createdKatakanaCards.map(
        (card) => new Types.ObjectId(card._id),
      ),
      romajiCards: createdRomajiCards.map(
        (card) => new Types.ObjectId(card._id),
      ),
    };

    return createdCards;
  }

  /** We will calculate the grade clientside. "remember === 1",
   *  "forgot" === 2. Start time on load, stop time on flip card
   */
  async reviewCard(cardId: string, grade: number): Promise<Card> {
    const card = await this.cardModel.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const { repetitions, interval, easeFactor } = card;

    let newRepetitions = repetitions;
    let newInterval = interval;
    let newEaseFactor = easeFactor;

    if (grade >= 3) {
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * easeFactor);
      }
      newRepetitions += 1;
    } else {
      newRepetitions = 0;
      newInterval = 1;
    }

    newEaseFactor += 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }

    card.repetitions = newRepetitions;
    card.interval = newInterval;
    card.easeFactor = newEaseFactor;
    card.lastReviewed = new Date();

    await card.save();
    return card;
  }
}
