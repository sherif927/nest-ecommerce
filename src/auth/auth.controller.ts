import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/shared/services/user/user.service';
import { UserModel } from 'src/types/dto/user.dto';

@Controller('auth')
export class AuthController {

  constructor(private userService: UserService) { }

  @Post('login')
  login(@Body() user: UserModel) {
    return this.userService.validateLogin(user);
  }

  @Post('register')
  register(@Body() user: UserModel) {
    return this.userService.register(user);
  }
}
