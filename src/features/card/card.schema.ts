import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { MetaPropertiesSchema } from 'src/features/common/common.schema';

@Schema()
export class Card extends MetaPropertiesSchema {
  @Prop()
  @ApiProperty()
  front: string;

  @Prop()
  @ApiProperty()
  back: string;

  @Prop({ type: Types.ObjectId, ref: 'decks' })
  @ApiProperty({ type: [String], description: 'Array of Deck ObjectIds' })
  deck: Types.ObjectId;

  @Prop({ default: null })
  @ApiProperty({ type: Date, required: false, default: null })
  lastReviewed?: Date;

  @Prop({ default: 1 })
  @ApiProperty({ default: 1 })
  interval: number;

  @Prop({ default: 0 })
  @ApiProperty({ default: 0 })
  repetitions: number;

  @Prop({ default: 2.5 })
  @ApiProperty({ default: 2.5 })
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
        data: {
          type: 'object',
          nullable: true,
          example: null,
        },
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
        data: {
          type: 'object',
          nullable: true,
          example: null,
        },
      },
    },
  },
};
