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
    }) as unknown as CreateCardDto[];

    const mappedKatakanaCards = defaultCardOpts.katakanaCards.map((card) => {
      return { ...card, deck: defaultDeckIds.katakanaDeck };
    }) as unknown as CreateCardDto[];

    const mappedRomajiCards = defaultCardOpts.romajiCards.map((card) => {
      return { ...card, deck: defaultDeckIds.romajiDeck };
    }) as unknown as CreateCardDto[];

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

  public async reviewCard(
    cardId: string,
    grade: number,
  ): Promise<IReadCard | null> {
    const card = await this.cardModel.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const { repetitions, interval, easeFactor } = card;

    let newRepetitions = repetitions;
    let newInterval = interval;
    let newEaseFactor = easeFactor;

    if (grade < 3) {
      newRepetitions = 0;
      newInterval = 1; // schedule for review tomorrow
    } else {
      newRepetitions += 1;
      newInterval = this.getNewInterval(
        newRepetitions,
        newInterval,
        newEaseFactor,
      );
    }

    newEaseFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
    );

    card.repetitions = newRepetitions;
    card.interval = newInterval;
    card.easeFactor = newEaseFactor;
    card.lastReviewed = new Date();

    await card.save();
    return card.toObject();
  }

  getNewInterval(
    repetitions: number,
    interval: number,
    easeFactor: number,
  ): number {
    if (repetitions === 1) return 1; // 1 day for first repetition
    if (repetitions === 2) return 6; // 6 days for second repetition
    return Math.round(interval * easeFactor); // thereafter
  }

  // works but it's too infrequent, not sensitive enough
  // we need results to come back based on ease of the card too, so if this fails
  // we should return cards that are low rated on the ease scale perhaps under 2?
  async getCardsForReview(
    deckId: Types.ObjectId,
  ): Promise<IReadManyAndCount<IReadCard>> {
    const now = new Date();

    const result = await this.cardModel
      .aggregate([
        { $match: { deck: deckId } },
        {
          $project: {
            front: 1,
            back: 1,
            deck: 1,
            lastReviewed: 1,
            interval: 1,
            dueDate: {
              $add: [
                '$lastReviewed',
                { $multiply: ['$interval', 24 * 60 * 60 * 1000] }, //convert days to milliseconds
              ],
            },
          },
        },
        { $match: { dueDate: { $lte: now } } },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            cards: [
              {
                $project: {
                  front: 1,
                  back: 1,
                  deck: 1,
                  lastReviewed: 1,
                  interval: 1,
                },
              },
            ],
          },
        },
      ])
      .exec();

    const totalCount = result[0].totalCount[0]
      ? result[0].totalCount[0].count
      : 0;
    const data = result[0].cards as IReadCard[];

    return { totalCount, data };
  }
}
