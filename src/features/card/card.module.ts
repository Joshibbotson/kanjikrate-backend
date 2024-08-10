import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './card.schema';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { DeckService } from '../deck/deck.service';
import { Deck, DeckSchema } from '../deck/deck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Deck.name, schema: DeckSchema },
    ]),
  ],
  controllers: [CardController],
  providers: [CardService, DeckService],
  exports: [CardService],
})
export class CardModule {}
