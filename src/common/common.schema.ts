import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export abstract class MetaPropertiesSchema {
  @Prop()
  createdDate?: Date;

  @Prop()
  updatedDate?: Date;

  @Prop()
  deletedDate?: Date;

  @Prop()
  __v: number;
}
