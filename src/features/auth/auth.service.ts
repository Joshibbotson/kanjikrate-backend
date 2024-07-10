import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { IUser } from '../user/user.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async validateToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWTKEY,
      });
      return decoded;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Failed to validate token');
      }
    }
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: Partial<IUser> }> {
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
    delete user.password;
    const token = await this.signToken(user.email);
    return { ...token, user };
  }

  public async signToken(email: string) {
    const payload = { email: email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWTKEY,
        expiresIn: '60m',
      }),
    };
  }
}
