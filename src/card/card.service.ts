import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { Card, CardDocument } from './card.schema';
import { Model } from 'mongoose';
import { CreateCardDto } from './card.types';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CardService extends CommonService<
  CreateCardDto,
  Card,
  CardDocument
> {
  constructor(
    @InjectModel(Card.name) public readonly cardModel: Model<CardDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cardModel, cacheManager);
  }

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
