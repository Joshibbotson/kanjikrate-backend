import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { MetaPropertiesSchema } from 'src/features/common/common.schema';

@Schema()
export class Deck extends MetaPropertiesSchema {
  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty({ required: false })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'users' })
  @ApiProperty({ type: String, required: false })
  owner?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'cards' }] })
  @ApiProperty({ type: [String], description: 'Array of Card ObjectIds' })
  cards: Types.ObjectId[];
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
        data: {
          type: 'object',
          nullable: true,
          example: null,
        },
      },
    },
  },
};

export const readDeckByFieldResponse = {
  success: {
    status: 200,
    description: 'Successfully read Deck by Field',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully read Deck by Field' },
        data: { $ref: getSchemaPath(Deck) },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to read deck by Field',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example:
            'Failed to read deck by Field with an error of: <error message>',
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
        data: {
          type: 'object',
          nullable: true,
          example: null,
        },
      },
    },
  },
};
