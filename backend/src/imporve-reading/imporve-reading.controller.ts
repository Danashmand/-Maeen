import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ImproveReadingService } from './imporve-reading.service';
import { ImproveReading } from './improve-reading.schema';

@Controller('improve-reading') // Fixed the spelling here as well
export class ImproveReadingController {
  constructor(private readonly improveReadingService: ImproveReadingService) {}

  @Post('data')
  async getImproveReading(@Body('levels') levels: { writing: number; reading: number; grammar: number }) {
    if (!levels ) {
      throw new HttpException('Levels parameter is required with all fields', HttpStatus.BAD_REQUEST);
    }

    const result = await this.improveReadingService.getImproveReadingData(levels);

    // Return the result with inserted data and story content
    return result; // Now this will return both inserted data and story content
  }
}
