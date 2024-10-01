import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(userId: string): Promise<User> {
    return this.userModel.findOne({ userId }).exec();
  }
  async updateLevel(UpdateUserDto:UpdateUserDto):Promise<User>  {
    return this.userModel.findOneAndUpdate({userId:UpdateUserDto.userId},{level:UpdateUserDto.level},{new:true}).exec();
  }
}
