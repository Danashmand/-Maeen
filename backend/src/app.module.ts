import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VirtualTeacherModule } from './virtual-teacher/virtual-teacher.module';
import { UserModule } from './users/users.module';
import { FirstExamModule } from './first-exam/first-exam.module';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpellingCorectionModule } from './spelling-corection/spelling-corection.module';
import { ReadingModule } from './reading/reading.module';


@Module({
  imports: [     ConfigModule.forRoot({ isGlobal: true }),  // Automatically loads .env file
    MongooseModule.forRoot("mongodb+srv://daleh:Dalleh123@cluster0.ul2ia.mongodb.net/Maeen?retryWrites=true&w=majority&appName=Cluster0Maeen"),

    VirtualTeacherModule, UserModule, FirstExamModule,  AuthModule, SpellingCorectionModule, ReadingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
