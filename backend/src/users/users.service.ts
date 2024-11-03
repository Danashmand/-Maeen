// src/user/user.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(email: string, password: string, name: string, level: any, score: number = 0): Promise<User> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword, name, level, score }); 
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
  async findByEmailGoogle(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Create a new user
  async createUserGoogle(userData: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  // Find user by ID
  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).select('-password'); // Don't return the password field
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Update user data (name or password)
  async updateUser(id: string, updateData: { name?: string; password?: string , level?:string ,score?:number }): Promise<User> {
    const user = await this.findById(id);
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    Object.assign(user, updateData);
    return user.save();
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }
  async updateUserLevel(userId: string, score: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Determine level based on the score received from the frontend
    if (score <= 2) {
      user.level = 'beginner';
    } else if (score > 2 && score < 5) {
      user.level = 'intermediate';
    } else if (score === 5) {
      user.level = 'expert';
    } else {
      user.level = 'undefined'; // Fallback, if needed
    }

    await user.save();
    return { userId: user._id, level: user.level };
  }
}
