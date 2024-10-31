import { Module } from '@nestjs/common';
import { SpellingCorectionService } from './spelling-corection.service';
import { SpellingCorectionController } from './spelling-corection.controller';

@Module({
  controllers: [SpellingCorectionController],
  providers: [SpellingCorectionService],
})
export class SpellingCorectionModule {}
