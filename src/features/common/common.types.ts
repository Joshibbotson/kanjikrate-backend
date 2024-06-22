import { ApiProperty } from '@nestjs/swagger';

export interface MetaProperties {
  createdDate: Date;
  updatedDate?: Date;
  deletedDate?: Date;
  __v: number;
}

export abstract class CommonDto {
  @ApiProperty({ description: 'Version key', example: 0 })
  readonly __v: number;
}

export interface Response<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
}

export interface IReadOpts {
  take?: number;
  skip?: number;
}