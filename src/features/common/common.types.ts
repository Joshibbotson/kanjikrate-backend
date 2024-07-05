import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export interface IMetaProperties {
  createdDate: Date;
  updatedDate?: Date;
  deletedDate?: Date;
  __v: number;
  _id: string;
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
  totalCount?: number;
}

export interface IReadManyAndCount<T> {
  data: T[];
  totalCount: number;
}

export interface IReadOpts {
  take?: number;
  skip?: number;
  populate?: string;
}

export interface IReadByFieldOpts extends IReadOpts {
  field: string;
  boolValue?: boolean;
  stringValue?: string;
  intValue?: number;
  objectId?: Types.ObjectId;
}

export class ReadManyDto {
  @ApiProperty({
    description: 'take value',
    required: false,
  })
  readonly take?: number;
  @ApiProperty({
    description: 'skip value',
    required: false,
  })
  readonly skip?: number;
  @ApiProperty({
    description: 'document to populate',
    required: false,
  })
  readonly populate?: string;
}

export class ReadByFieldDto extends ReadManyDto {
  @ApiProperty({
    description: 'Field to search by',
    required: true,
  })
  readonly field: string;

  @ApiProperty({
    description: 'Optional boolean value',
    required: false,
  })
  readonly boolValue?: boolean;

  @ApiProperty({
    description: 'Optional string value',
    required: false,
  })
  readonly stringValue?: string;

  @ApiProperty({
    description: 'Optional int value',
    required: false,
  })
  readonly intValue?: number;

  @ApiProperty({
    description: 'Optional _id value',
    required: false,
  })
  readonly objectId?: string;
}
