import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { MetaPropertiesSchema } from 'src/features/common/common.schema';

@Schema()
export class User extends MetaPropertiesSchema {
  @Prop({ type: String })
  @ApiProperty()
  googleUserId: string;

  @Prop({ default: true })
  @ApiProperty({ default: true })
  active: boolean;

  @Prop()
  @ApiProperty({ required: false })
  email?: string;

  @Prop()
  @ApiProperty({ required: false })
  password?: string;

  @Prop()
  @ApiProperty({ required: false })
  locale?: string;

  @Prop()
  @ApiProperty({ required: false })
  name?: string;

  @Prop({ type: [String] })
  @ApiProperty({ type: [String] })
  permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = Document<Types.ObjectId> & User;

export const createUserResponse = {
  success: {
    status: 200,
    description: 'Successfully created User',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully created User' },
        data: { $ref: getSchemaPath(User) },
        token: { type: 'string', example: 'dsfdsfdsfds' },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to create user',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Failed to create user with an error of: <error message>',
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

export const readUserByIdResponse = {
  success: {
    status: 200,
    description: 'Successfully read User',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 200 },
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Successfully read User' },
        data: { $ref: getSchemaPath(User) },
      },
    },
  },
  error: {
    status: 500,
    description: 'Failed to read user',
    schema: {
      properties: {
        code: { type: 'number', example: 500 },
        success: { type: 'boolean', example: false },
        message: {
          type: 'string',
          example: 'Failed to read user with an error of: <error message>',
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
