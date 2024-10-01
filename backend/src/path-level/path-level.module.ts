import { Module } from '@nestjs/common';
import { PathLevelService } from './path-level.service';
import { PathLevelController } from './path-level.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PathLevelSchema } from './path-level.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'PathLevel', schema: PathLevelSchema }])],  
  controllers: [PathLevelController],
  providers: [PathLevelService],
})
export class PathLevelModule {}
