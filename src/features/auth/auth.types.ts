import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.schema';

export interface ILoginResponse {
  code: number;
  success: boolean;
  message: string;
  token: string;
  user: Partial<User>;
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

export class IValidateTokenOpts {
  @ApiProperty({
    description: 'token for validation',
    example: 'jinib32irbi32bfinb2i',
  })
  readonly token: string;
}
