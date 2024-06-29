import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CommonService } from 'src/features/common/common.service';
import { CreateUserDto, IUser } from './user.types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { DeckService } from '../deck/deck.service';

@Injectable()
export class UserService extends CommonService<
  CreateUserDto,
  IUser,
  UserDocument
> {
  constructor(
    @InjectModel(User.name) userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) cacheManager: Cache,
    private readonly _deckService: DeckService,
  ) {
    super(userModel, cacheManager);
  }

  public async registerUser(user: CreateUserDto) {
    const saltOrRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, saltOrRounds);
    user.password = hash;
    const newUser = await this.create(user);
    await this._deckService.createDefaultDecks(new Types.ObjectId(newUser._id));
    return newUser;
  }
}
