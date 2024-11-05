import { Module } from '@nestjs/common';
import { SpellingCorrectionService } from './spelling-corection.service';
import { SpellingCorectionController } from './spelling-corection.controller';

@Module({
  controllers: [SpellingCorectionController],
  providers: [SpellingCorrectionService],
})
export class SpellingCorectionModule {}
