// src/user/user.controller.ts
import { Controller, Get, Param, Query, Patch, Delete, Body, UseGuards, Request, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user._id;

    if (!userId) {
      throw new Error('User ID not found in request.');
    }

    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error('User not found.');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  @Get('email')
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(@Request() req, @Body() updateData: { name?: string; password?: string; levels?: { writing?: number; reading?: number; grammar?: number } }) {
    const userId = req.user._id;
    return this.userService.updateUser(userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteUser(@Request() req) {
    const userId = req.user._id;
    return this.userService.deleteUser(userId);
  }

  @Post('update-user-level')
  async updateUserLevel(@Body() body: { userId: string; levels: { writing?: number; reading?: number; grammar?: number } }) {
    return this.userService.updateUserLevels(body.userId, body.levels);
  }

  @Post('create')
  async createUser(
    @Body() body: { email: string; password: string; name: string; levels?: { writing?: number; reading?: number; grammar?: number }; score?: number },
  ) {
    const { email, password, name, levels, score } = body;
    return this.userService.createUser(email, password, name, levels, score);
  }
}
