import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/shared/services/user/user.service';
import * as Bcrypt from 'bcrypt';
import { ModelSanatizer } from 'src/shared/utils/class.sanatizer';
import { User } from 'src/types/user';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, private jwtService: JwtService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    let user = await this.userService.findOneBy({ username });
    if (!user || await Bcrypt.compare(user.password, password))
      throw new UnauthorizedException();
    const payload = { username: user.username, sub: user.id };
    user = ModelSanatizer.desanatizeModel<User>(user, ['password']);
    const access_token: string = this.jwtService.sign(payload);
    const response = { ...user, access_token };
    return response;
  }
}