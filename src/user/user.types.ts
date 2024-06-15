import { CommonDto, MetaProperties } from 'src/common/common.types';

export interface IUser extends MetaProperties {
  _id: string;
  active: boolean;
  authUserId: string;
  email?: string;
  locale?: string;
  name?: string;
  permissions: string[];
}

export class CreateUserDto extends CommonDto {
  readonly active: boolean;
  readonly authUserId: string;
  readonly email?: string;
  readonly locale?: string;
  readonly name?: string;
  readonly permissions: string[];
}
