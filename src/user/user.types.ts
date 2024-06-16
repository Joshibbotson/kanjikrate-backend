import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
  })
  readonly active: boolean;

  @ApiProperty({
    description: 'The authentication user ID',
    example: 'authUserId123',
  })
  readonly authUserId: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    required: false,
  })
  readonly email?: string;

  @ApiProperty({
    description: 'The locale of the user',
    example: 'en-US',
    required: false,
  })
  readonly locale?: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  readonly name?: string;

  @ApiProperty({
    description: 'The permissions of the user',
    example: ['read', 'write'],
  })
  readonly permissions: string[];
}
