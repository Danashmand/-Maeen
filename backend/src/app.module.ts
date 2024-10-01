import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { FirstExamModule } from './first-exam/first-exam.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { PathLevelModule } from './path-level/path-level.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [  MongooseModule.forRoot("mongodb://localhost/Maeen"),

     ChatModule, UsersModule, FirstExamModule, LearningPathModule, PathLevelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
