import { Module } from '@nestjs/common';
import { VirtualTeacherService } from './virtual-teacher.service';
import { VirtualTeacherController } from './virtual-teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VirtualTeacherSchema } from './virtual-teacher.schema';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VirtualTeacher', schema: VirtualTeacherSchema }]),
    HttpModule,
    UserModule
  ],
  controllers: [VirtualTeacherController],
  providers: [VirtualTeacherService],
})
export class VirtualTeacherModule {}