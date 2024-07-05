import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  _id: string;
}
