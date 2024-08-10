import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AuthService } from '../auth/auth.service';
import { DeckModule } from '../deck/deck.module';
import { EmailTransporterAdapterService } from 'src/util/email-transporter-adapter/email-transporter-adapter.service';

@Module({
  imports: [
    DeckModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, EmailTransporterAdapterService],
  exports: [UserService],
})
export class UserModule {}
