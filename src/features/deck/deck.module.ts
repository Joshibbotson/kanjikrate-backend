import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from './deck.schema';
import { DeckController } from './deck.controller';
import { DeckService } from './deck.service';
import { CardModule } from '../card/card.module';
import { Card, CardSchema } from '../card/card.schema';

@Module({
  imports: [
    CardModule,
    MongooseModule.forFeature([
      { name: Deck.name, schema: DeckSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [DeckController],
  providers: [DeckService],
  exports: [DeckService],
})
export class DeckModule {}
