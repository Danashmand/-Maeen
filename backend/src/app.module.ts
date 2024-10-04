import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './users/users.module';
import { FirstExamModule } from './first-exam/first-exam.module';
import { LearningPathModule } from './learning-path/learning-path.module';
import { PathLevelModule } from './path-level/path-level.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [     ConfigModule.forRoot({ isGlobal: true }),  // Automatically loads .env file
    MongooseModule.forRoot("mongodb+srv://daleh:Dalleh123@cluster0.ul2ia.mongodb.net/Maeen?retryWrites=true&w=majority&appName=Cluster0Maeen"),

     ChatModule, UserModule, FirstExamModule, LearningPathModule, PathLevelModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
