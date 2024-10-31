import { Controller } from '@nestjs/common';
import { SpellingCorectionService } from './spelling-corection.service';

@Controller('spelling-corection')
export class SpellingCorectionController {
  constructor(private readonly spellingCorectionService: SpellingCorectionService) {}
}
