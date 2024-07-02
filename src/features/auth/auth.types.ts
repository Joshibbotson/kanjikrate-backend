import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../user/user.types';

export interface ILoginResponse {
  code: number;
  success: boolean;
  message: string;
  token: string;
  user: Partial<IUser>;
}

export class ILoginOpts {
  @ApiProperty({
    description: 'email used to login',
    example: 'example@hotmail.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'password used to login',
    example: 'agoodpassword12345!',
  })
  readonly password: string;
}
