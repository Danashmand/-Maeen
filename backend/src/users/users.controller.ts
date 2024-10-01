import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') userId: string) {
    return this.userService.findOne(userId);
  }
  @Post("updateLevel")
  updateLevel(@Body() UpdateUserDto:UpdateUserDto) {
    return this.userService.updateLevel(UpdateUserDto);
  }
}
