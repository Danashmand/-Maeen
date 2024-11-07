import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ImproveReadingService } from './imporve-reading.service';
import { ImproveReading } from './improve-reading.schema';

@Controller('imporve-reading')
export class ImporveReadingController {
  constructor(private readonly imporveReadingService: ImproveReadingService) {}

  @Post('data')
  async getImproveReading(@Body('levels') levels: { writing: number; reading: number; grammar: number }): Promise<ImproveReading[]> {
    if (!levels) {
      throw new HttpException('Levels parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.imporveReadingService.getImproveReadingData(levels);
  }
}
