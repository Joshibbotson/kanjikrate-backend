import { Inject, Injectable } from '@nestjs/common';
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
    @InjectModel(Card.name) cardModel: Model<CardDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(cardModel, cacheManager);
  }
}
