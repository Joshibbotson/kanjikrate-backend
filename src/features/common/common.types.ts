import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export interface IMetaProperties {
  createdDate: Date;
  updatedDate?: Date;
  deletedDate?: Date;
  __v: number;
}

export abstract class CommonDto {
  @ApiProperty({ description: 'Version key', example: 0 })
  readonly __v: number;
}

export interface IResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
}

export interface IReadOpts {
  take?: number;
  skip?: number;
  populate?: string;
}

export interface IReadByField extends IReadOpts {
  field: string;
  boolValue?: boolean;
  stringValue?: string;
  intValue?: number;
  objectId?: Types.ObjectId;
}
