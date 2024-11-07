// src/spelling-corection/spelling-corection.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SpellingCorrectionService } from './spelling-corection.service';

@Controller('spelling-correction')
export class SpellingCorrectionController {
  constructor(private readonly spellingCorrectionService: SpellingCorrectionService) {}

  @Post('correct')
  async correctText(
    @Body() body: { text: string; levels: { writing: number; reading: number; grammar: number } }
  ) {
    const correctedText = await this.spellingCorrectionService.correctSpelling(body.text, body.levels);
    return { correctedText };
  }
}
