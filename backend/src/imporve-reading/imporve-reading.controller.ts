import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ImproveReadingService } from './imporve-reading.service';
import { ImproveReading } from './improve-reading.schema';

@Controller('imporve-reading')
export class ImporveReadingController {
  constructor(private readonly imporveReadingService: ImproveReadingService) {}

  @Get('data')
  async getImproveReading(@Query('levels') levels: { writing: number; reading: number; grammer: number } ): Promise<ImproveReading[]> {
    if (!levels) {
      
      throw new HttpException('Levels parameter is required', HttpStatus.BAD_REQUEST);
    }

    return this.imporveReadingService.getImproveReadingData({
      writing: levels.writing, 
      reading: levels.reading, 
      grammar: levels.grammer // Correct the spelling here in the service method to match the expected parameter
    });
  }
}
