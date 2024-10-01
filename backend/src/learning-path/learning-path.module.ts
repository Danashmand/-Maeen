import { Module } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { LearningPathController } from './learning-path.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LearningPathSchema } from './learning-path.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'learning path', schema: LearningPathSchema }])],  

  controllers: [LearningPathController],
  providers: [LearningPathService],
})
export class LearningPathModule {}
