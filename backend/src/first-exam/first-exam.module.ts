import { Module } from '@nestjs/common';
import { FirstExamService } from './first-exam.service';
import { FirstExamController } from './first-exam.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FirstExamSchema } from './first-exam.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'First Exam', schema: FirstExamSchema }])],  

  controllers: [FirstExamController],
  providers: [FirstExamService],
})
export class FirstExamModule {}
