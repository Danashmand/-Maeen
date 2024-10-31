import { Controller } from '@nestjs/common';
import { ReadingService } from './reading.service';

@Controller('reading')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}
}
