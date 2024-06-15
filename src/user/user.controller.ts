import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.types';
import { User } from './user.schema';
import { Response } from 'src/common/common.types';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    try {
      const data = await this._userService.create(createUserDto);
      return {
        code: 200,
        success: true,
        message: 'Successfully created User',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to create user with an error of: ${err.message}`,
        data: null,
      };
    }
  }

  @Get('readById/:id')
  async readById(@Param('id') id: string): Promise<Response<User>> {
    try {
      const data = await this._userService.findById(id);
      return {
        code: 200,
        success: true,
        message: 'Successfully read User',
        data,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to read user with an error of: ${err.message}`,
        data: null,
      };
    }
  }
}
