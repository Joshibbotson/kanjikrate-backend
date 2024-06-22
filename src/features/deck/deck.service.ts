import { Inject, Injectable } from '@nestjs/common';
import { CommonService } from 'src/features/common/common.service';
import { Deck, DeckDocument } from './deck.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeckDto } from './deck.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class DeckService extends CommonService<
  CreateDeckDto,
  Deck,
  DeckDocument
> {
  constructor(
    @InjectModel(Deck.name) deckModel: Model<DeckDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(deckModel, cacheManager);
  }
}
