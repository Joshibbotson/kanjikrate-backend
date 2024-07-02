import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateToken(token: string) {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWTKEY,
    });
    return decoded;
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const query = { email: email };
    const user = await this.userService.findOne(query);
    if (user === null) {
      throw new Error('No associated user');
    }
    const hashedPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    return this.signToken(user.email);
  }

  public async signToken(email: string) {
    const payload = { email: email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWTKEY,
        expiresIn: '1h',
      }),
    };
  }
}
