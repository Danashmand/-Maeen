import { Module } from '@nestjs/common';
import { VirtualTeacherService } from './virtual-teacher.service';
import { virtualTeacherController } from './virtual-teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VirtualTeacherSchema } from './virtual-teacher.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'VirtualTeacher', schema: VirtualTeacherSchema }]),
    HttpModule
  ],
  controllers: [virtualTeacherController],
  providers: [VirtualTeacherService],
})
export class VirtualTeacherModule {}