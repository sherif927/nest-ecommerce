import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from 'src/types/dto/user.dto';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }

  private desanitizeUser(user: User, fields: string[]): User {
    fields.forEach(field => user.depopulate(field));
    return user;
  }

  async register(user: UserModel): Promise<User> {
    const newUser = await this.userModel.create(user);
    await newUser.save();
    return this.desanitizeUser(newUser, ['password']);
  }


  async validateLogin(user: UserModel) {
    const { username, password } = user;
    const existingUser = await this.userModel.findOne({ username });
    if (!existingUser || await Bcrypt.compare(password, existingUser.password))
      throw new BadRequestException();
    return this.desanitizeUser(existingUser, ['password']);
  }
}
