import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CommonDto, MetaProperties } from 'src/common/common.types';

export interface ICard extends MetaProperties {
  _id: string;
  front: string;
  back: string;
  masteryLevel: number;
  nextReviewDate: Date;
}

@ApiExtraModels()
export class CreateCardDto extends CommonDto {
  @ApiProperty({
    description: 'The front text of the card',
    example: 'Front text example',
  })
  readonly front: string;

  @ApiProperty({
    description: 'The back text of the card',
    example: 'Back text example',
  })
  readonly back: string;

  @ApiProperty({ description: 'The mastery level of the card', example: 1 })
  readonly masteryLevel: number;

  @ApiProperty({
    description: 'The next review date of the card',
    example: '2024-07-20T00:00:00.000Z',
  })
  readonly nextReviewDate: Date;
}
