import { CommonDto, MetaProperties } from 'src/common/common.types';

export interface ICard extends MetaProperties {
  _id: string;
  front: string;
  back: string;
  masteryLevel: number;
  nextReviewDate: Date;
}

export class CreateCardDto extends CommonDto {
  readonly front: string;
  readonly back: string;
  readonly masteryLevel: number;
  readonly nextReviewDate: Date;
}
