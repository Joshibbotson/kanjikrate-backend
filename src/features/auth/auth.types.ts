import { ApiProperty } from '@nestjs/swagger';

export interface ILoginResponse {
  code: number;
  success: boolean;
  message: string;
  token: string;
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
