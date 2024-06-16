import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getSchemaPath } from '@nestjs/swagger';
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

export const createDeckResponse = {
  success: {
    status: 200,
    description: 'Successfully created Deck',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully created Deck' },
        data: { $ref: getSchemaPath(Deck) },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to create deck',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Failed to create deck with an error of: <error message>',
        },
        data: { type: 'null', example: null },
      },
    },
  },
};

export const readDeckByIdResponse = {
  success: {
    status: 200,
    description: 'Successfully read Deck',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully read Deck' },
        data: { $ref: getSchemaPath(Deck) },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to read deck',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Failed to read deck with an error of: <error message>',
        },
        data: { type: 'null', example: null },
      },
    },
  },
};
