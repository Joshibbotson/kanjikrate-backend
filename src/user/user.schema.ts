import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MetaPropertiesSchema } from 'src/common/common.schema';

@Schema()
export class User extends MetaPropertiesSchema {
  @Prop({ type: String })
  authUserId: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  email?: string;

  @Prop()
  locale?: string;

  @Prop()
  name?: string;

  @Prop({ type: [String] })
  permissions: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = Document<Types.ObjectId> & User;
