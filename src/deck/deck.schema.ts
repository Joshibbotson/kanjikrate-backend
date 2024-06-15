import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Card } from 'src/card/card.schema';
import { MetaPropertiesSchema } from 'src/common/common.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Deck extends MetaPropertiesSchema {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop()
  owner?: User;

  @Prop()
  cards: Card[];
}

export const DeckSchema = SchemaFactory.createForClass(Deck);
export type DeckDocument = Document<Types.ObjectId> & Deck;
