import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({ secretOrKey: configService.get<string>('JWT') });
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.signIn(email, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
