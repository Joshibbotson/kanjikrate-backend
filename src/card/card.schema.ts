import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getSchemaPath } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { MetaPropertiesSchema } from 'src/common/common.schema';
import { Deck } from 'src/deck/deck.schema';

@Schema()
export class Card extends MetaPropertiesSchema {
  @Prop()
  front: string;

  @Prop()
  back: string;

  @Prop()
  deck: Deck;

  @Prop({ default: null })
  lastReviewed?: Date;

  @Prop({ default: 1 })
  interval: number;

  @Prop({ default: 0 })
  repetitions: number;

  @Prop({ default: 2.5 })
  easeFactor: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
export type CardDocument = Document<Types.ObjectId> & Card;

export const createCardResponse = {
  success: {
    status: 200,
    description: 'Successfully created Card',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully created Card' },
        data: { $ref: getSchemaPath(Card) },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to create card',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Failed to create card with an error of: <error message>',
        },
        data: { type: 'null', example: null },
      },
    },
  },
};

export const readCardByIdResponse = {
  success: {
    status: 200,
    description: 'Successfully read Card',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully read Card' },
        data: { $ref: getSchemaPath(Card) },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to read card',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Failed to read card with an error of: <error message>',
        },
        data: { type: 'null', example: null },
      },
    },
  },
};
