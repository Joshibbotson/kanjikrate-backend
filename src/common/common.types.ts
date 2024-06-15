export interface MetaProperties {
  createdDate: Date;
  updatedDate?: Date;
  deletedDate?: Date;
  __v: number;
}

export abstract class CommonDto {
  readonly __v: number;
}

export interface Response<T> {
  code: number;
  success: boolean;
  message: string;
  data?: T;
}
