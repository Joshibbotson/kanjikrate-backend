import { ApiProperty } from '@nestjs/swagger';
import { ICard } from 'src/card/card.types';
import { CommonDto, MetaProperties } from 'src/common/common.types';
import { IUser } from 'src/user/user.types';

export interface IDeck extends MetaProperties {
  _id: string;
  name: string;
  description: string;
  owner: IUser;
  cards: ICard[];
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

  @ApiProperty({ description: 'The owner of the deck', type: Object })
  readonly owner: IUser;

  @ApiProperty({ description: 'The cards in the deck', type: [Object] })
  readonly cards: ICard[];
}
