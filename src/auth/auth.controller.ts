import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { UserModel } from '../types/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { UserService } from '../shared/services/user/user.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SellerGuard } from './guards/seller.guard';
import { AuthUser } from './auth.user.dec';


@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService, private userService: UserService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() request) {
    return request.user;
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @Get()
  findAll(@AuthUser() user) {
    return this.userService.findAll();
  }

  @Post('register')
  register(@Body() user: UserModel) {
    return this.authService.register(user);
  }
}
