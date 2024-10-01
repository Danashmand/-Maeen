import { Module } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { UserController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
