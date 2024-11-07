import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ImporveReadingService } from './imporve-reading.service';
import { ImproveReading } from './improve-reading.schema';

@Controller('imporve-reading')
export class ImporveReadingController {
  constructor(private readonly imporveReadingService: ImporveReadingService) {}

  @Get('data')
  async getImproveReading(@Query('levels') levels: string): Promise<ImproveReading[]> {
    if (!levels) {
      throw new HttpException('Levels parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.imporveReadingService.getImproveReadingData(levels);
  }
}
