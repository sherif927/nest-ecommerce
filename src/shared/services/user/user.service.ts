import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from '../../../types/user';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../../../types/dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) { }

  async create(user: UserModel): Promise<User> {
    let newUser = await this.userModel.create(user)
      .catch(e => { throw new BadRequestException(e.message) });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findBy(query: any): Promise<User[]> {
    return this.userModel.find(query).exec();
  }

  async findOneBy(query: any): Promise<User> {
    return this.userModel.findOne(query);
  }
}
