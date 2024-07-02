import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { loginResponse, validateTokenResponse } from './auth.schema';
import { ILoginOpts, ILoginResponse } from './auth.types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login', operationId: 'login' })
  @ApiResponse(loginResponse.success)
  @ApiResponse(loginResponse.error)
  @ApiResponse(loginResponse.notFound)
  public async signIn(@Body() loginOpts: ILoginOpts): Promise<ILoginResponse> {
    try {
      const data = await this._authService.signIn(
        loginOpts.email,
        loginOpts.password,
      );
      return {
        code: 200,
        success: true,
        message: 'Successfully logged in',
        token: data.access_token,
      };
    } catch (err) {
      throw new HttpException(
        {
          status: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: err.message || 'Failed to login',
        },
        err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Post('validateToken')
  @ApiOperation({ summary: 'Validate Token', operationId: 'validateToken' })
  @ApiResponse(validateTokenResponse.success)
  @ApiResponse(validateTokenResponse.error)
  public async validateToken(@Body() opts: { token: string }) {
    console.log(opts);
    try {
      const data = await this._authService.validateToken(opts.token);
      return {
        code: 200,
        success: true,
        message: 'Valid user',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to validate token with an error of: ${err.message}`,
        data: null,
      };
    }
  }
}
