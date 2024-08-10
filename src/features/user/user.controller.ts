import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ICreateUserResponse } from './user.types';
import { User, createUserResponse, readUserByIdResponse } from './user.schema';
import { IResponse } from 'src/features/common/common.types';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from '../auth/auth.service';
import { EmailTransporterAdapterService } from 'src/util/email-transporter-adapter/email-transporter-adapter.service';

@ApiTags('User')
@ApiExtraModels(User)
@Controller('user')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _authService: AuthService,
    private readonly _emailTransportAdapterService: EmailTransporterAdapterService,
  ) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Create user', operationId: 'createUser' })
  @ApiResponse(createUserResponse.success)
  @ApiResponse(createUserResponse.error)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUserResponse> {
    try {
      const data = await this._userService.registerUser(createUserDto);
      const authLogin = await this._authService.signToken(data.email);
      const email = await this._emailTransportAdapterService.sendEmail(
        'joshua_ibbotson@hotmail.com',
        'hello world',
        '<h1>Hello World!</h1>',
      );
      console.log(email);
      return {
        code: 200,
        success: true,
        message: 'Successfully created User',
        data,
        token: authLogin.access_token,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed to create user with an error of: ${err.message}`,
        data: null,
        token: null,
      };
    }
  }

  @Get('readById/:id')
  @ApiOperation({ summary: 'Read user by Id', operationId: 'readUserById' })
  @ApiResponse(readUserByIdResponse.success)
  @ApiResponse(readUserByIdResponse.error)
  async readById(@Param('id') id: string): Promise<IResponse<User>> {
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
