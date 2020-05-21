import { Injectable, BadRequestException } from '@nestjs/common';
import { UserModel } from 'src/types/dto/user.dto';
import { UserService } from 'src/shared/services/user/user.service';
import { User } from 'src/types/user';
import { ModelSanatizer } from 'src/shared/utils/class.sanatizer';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private userService: UserService, private jwtService: JwtService) { }

  async register(user: UserModel): Promise<any> {
    let newUser = await this.userService.create(user);
    const payload = { sub: newUser.id, username: newUser.username };
    let token = this.jwtService.sign(payload);
    newUser = ModelSanatizer.desanatizeModel<User>(newUser, ['password']);
    return { ...newUser, token };
  }
}
