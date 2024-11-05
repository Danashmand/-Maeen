import { Controller, Post, Body } from '@nestjs/common';
import { SpellingCorrectionService } from './spelling-corection.service';

@Controller('spelling-correction')
export class SpellingCorrectionController {
  constructor(private readonly spellingCorrectionService: SpellingCorrectionService) {}

  @Post('correct')
  async correctText(@Body() body: { text: string }) {
    const correctedText = await this.spellingCorrectionService.correctSpelling(body.text);
    return { correctedText };
  }
}
