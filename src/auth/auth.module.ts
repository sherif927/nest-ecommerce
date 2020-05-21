import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SharedModule } from '../shared/shared.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './services/jwt.strategy';
import { LocalStrategy } from './services/local.strategy';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET || 'qwerty123',
      signOptions: { expiresIn: "10h" },
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy
  ]
})
export class AuthModule { }
