import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CommonService } from 'src/features/common/common.service';
import { CreateUserDto } from './user.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends CommonService<
  CreateUserDto,
  User,
  UserDocument
> {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
  ) {
    super(userModel, cacheManager);
  }

  public async registerUser(user: CreateUserDto) {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;
    console.log(user);
    return await this.create(user);
  }
}
