import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CommonDto, IMetaProperties } from 'src/features/common/common.types';

export interface IReadDeck extends IMetaProperties {
  name: string;
  description: string;
  owner: Types.ObjectId;
  cards: Types.ObjectId[];
}

export interface IDefaultDecks {
  hiraganaDeck: Types.ObjectId;
  katakanaDeck: Types.ObjectId;
  romajiDeck: Types.ObjectId;
}

export class CreateDeckDto extends CommonDto {
  @ApiProperty({
    description: 'The name of the deck',
    example: 'Deck name example',
  })
  readonly name: string;

  @ApiProperty({
    description: 'The description of the deck',
    example: 'Deck description example',
  })
  readonly description: string;

  @ApiProperty({ description: 'The owner of the deck', type: Types.ObjectId })
  readonly owner: Types.ObjectId;

  @ApiProperty({
    type: [String],
    description: 'Array of Card ObjectIds',
    required: false,
  })
  cards?: Types.ObjectId[];
}
