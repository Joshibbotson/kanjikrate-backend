import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DeckModule } from './features/deck/deck.module';
import { CardModule } from './features/card/card.module';
import { AuthGuard } from './features/auth/auth.guard';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_DSN),
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
      max: 10,
    }),
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: '60m' },
    }),

    PassportModule,
    UserModule,
    DeckModule,
    CardModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
