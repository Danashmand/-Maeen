import { Controller } from '@nestjs/common';
import { ImporveReadingService } from './imporve-reading.service';

@Controller('imporve-reading')
export class ImporveReadingController {
  constructor(private readonly imporveReadingService: ImporveReadingService) {}
}
