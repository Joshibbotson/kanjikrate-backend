import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

@Schema()
export abstract class MetaPropertiesSchema {
  @Prop()
  @ApiProperty()
  createdDate?: Date;

  @Prop()
  @ApiProperty()
  updatedDate?: Date;

  @Prop()
  @ApiProperty()
  deletedDate?: Date;

  @Prop()
  @ApiProperty()
  __v: number;

  @Prop({ type: Types.ObjectId })
  @ApiProperty()
  _id: Types.ObjectId;
}
