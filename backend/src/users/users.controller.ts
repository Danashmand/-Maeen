// src/user/user.controller.ts
import { Controller, Get, Param, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get details of the currently authenticated user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const userId = req.user._id;
    return this.userService.findById(userId);
  }

  // Get user details by user ID (for admin purposes, for example)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // Update user information (name, password, etc.)
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateUser(@Request() req, @Body() updateData: { name?: string; password?: string }) {
    const userId = req.user._id;
    return this.userService.updateUser(userId, updateData);
  }

  // Delete the authenticated user's account
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteUser(@Request() req) {
    const userId = req.user._id;
    return this.userService.deleteUser(userId);
  }
}
