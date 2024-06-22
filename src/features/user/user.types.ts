import { ApiProperty } from '@nestjs/swagger';
import { CommonDto, MetaProperties } from 'src/features/common/common.types';

export interface IUser extends MetaProperties {
  _id: string;
  active: boolean;
  googleUserId: string;
  email: string;
  password?: string;
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
    description: 'Google authentication user ID',
    example: 'googleUserId123',
  })
  readonly googleUserId: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
    required: false,
  })
  readonly email?: string;

  @ApiProperty({
    description: 'hashed password',
    example: 'sdfdsfdsfdsf123123',
    required: false,
  })
  password?: string;
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
