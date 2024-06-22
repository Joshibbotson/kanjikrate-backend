import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.types';
import { User, createUserResponse, readUserByIdResponse } from './user.schema';
import { Response } from 'src/features/common/common.types';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Create user', operationId: 'createUser' })
  @ApiResponse(createUserResponse.success)
  @ApiResponse(createUserResponse.error)
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    try {
      const data = await this._userService.registerUser(createUserDto);
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
  @ApiOperation({ summary: 'Read user by Id', operationId: 'readUserById' })
  @ApiResponse(readUserByIdResponse.success)
  @ApiResponse(readUserByIdResponse.error)
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

  // @Get('validateToken')
  // @ApiResponse()
  // @ApiResponse()
  // async validateJwtToken(
  //   @Body('token') token: string,
  // ): Promise<Response<boolean>> {
  //   try {
  //     const data = await this._userService.validateToken(token);
  //     return {
  //       code: 200,
  //       success: true,
  //       message: 'Successful token validation',
  //       data,
  //     };
  //   } catch (err) {
  //     return {
  //       code: 500,
  //       success: false,
  //       message: `Failed to validate token with an error of: ${err.message}`,
  //       data: null,
  //     };
  //   }
  // }
}