import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    try {
      console.log(signInDto);
      const data = await this.authService.signIn(
        signInDto.email,
        signInDto.password,
      );
      return {
        code: 200,
        success: true,
        message: 'Successfully logged in',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to login with an error of: ${err.message}`,
        data: null,
      };
    }
  }
}
