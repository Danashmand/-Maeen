import { Module } from '@nestjs/common';
import { SpellingCorrectionService } from './spelling-corection.service';
import { SpellingCorrectionController } from './spelling-corection.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SpellingCorrectionController],
  providers: [SpellingCorrectionService],
})
export class SpellingCorectionModule {}
