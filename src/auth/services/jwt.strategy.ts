import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../shared/services/user/user.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET || 'qwerty123',
    });
  }

  async validate(payload: any) {
    const { username, sub } = payload;
    const user = await this.userService.findOneBy({ id: sub });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}