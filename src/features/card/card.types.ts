import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommonDto, IMetaProperties } from 'src/features/common/common.types';

export interface IReadCard extends IMetaProperties {
  front: string;
  back: string;
  lastReviewed?: Date;
  interval: number;
  repetitions: number;
  easeFactor: number;
  deck: string;
}

@ApiExtraModels()
export class ReviewCardDto {
  @ApiProperty({
    description: 'The score of a card review',
    example: 5,
  })
  readonly score: number;
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

  @ApiProperty({
    description: 'The deckId the card belongs to',
    example: 'j98h8hy87fh387',
  })
  readonly deck: Types.ObjectId;

  @ApiProperty({
    description: 'The date the card was last reviewed',
    example: '2024-06-16T19:23:00Z',
    required: false,
  })
  readonly lastReviewed?: Date;

  @ApiProperty({
    description:
      'The interval (in days) before the card will be reviewed again',
    example: 7,
  })
  readonly interval: number;

  @ApiProperty({
    description: 'The number of times the card has been reviewed',
    example: 3,
  })
  readonly repetitions: number;

  @ApiProperty({
    description:
      'The ease factor of the card, representing how easy it is to remember',
    example: 2.5,
  })
  readonly easeFactor: number;
}
