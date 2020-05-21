import { Injectable, BadRequestException } from '@nestjs/common';
import { UserModel } from '../../types/dto/user.dto';
import { UserService } from '../../shared/services/user/user.service';
import { User } from '../../types/user';
import { ModelSanatizer } from '../../shared/utils/class.sanatizer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private userService: UserService, private jwtService: JwtService) { }

  async register(user: UserModel): Promise<any> {
    const existingUser = await this.userService.findOneBy({ username: user.username });
    if (existingUser) throw new BadRequestException('User already exists');
    let newUser = await this.userService.create(user);
    const payload = { sub: newUser.id, username: newUser.username };
    let token = this.jwtService.sign(payload);
    newUser = ModelSanatizer.desanatizeModel<User>(newUser, ['password']);
    return { ...newUser, token };
  }
}
