import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MetaPropertiesSchema } from 'src/common/common.schema';

@Schema()
export class Card extends MetaPropertiesSchema {
  @Prop()
  front: string;

  @Prop()
  back: string;

  @Prop()
  masteryLevel: number;

  @Prop()
  nextReviewDate: Date;
}

export const CardSchema = SchemaFactory.createForClass(Card);
export type CardDocument = Document<Types.ObjectId> & Card;
