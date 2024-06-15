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
  readonly name: string;
  readonly description: string;
  readonly owner: IUser;
  readonly cards: ICard[];
}
