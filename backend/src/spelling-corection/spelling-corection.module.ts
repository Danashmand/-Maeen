import { Module } from '@nestjs/common';
import { SpellingCorrectionService } from './spelling-corection.service';
import { SpellingCorrectionController } from './spelling-corection.controller';

@Module({
  controllers: [SpellingCorrectionController],
  providers: [SpellingCorrectionService],
})
export class SpellingCorectionModule {}
