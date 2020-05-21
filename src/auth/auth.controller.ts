import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserModel } from '../types/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() request) {
    return request.user;
  }

  @Post('register')
  register(@Body() user: UserModel) {
    return this.authService.register(user);
  }
}
