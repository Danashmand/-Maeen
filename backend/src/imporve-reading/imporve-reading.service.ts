import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { ImproveReading } from './improve-reading.schema';

@Injectable()
export class ImporveReadingService {
  constructor(
    @InjectModel(ImproveReading.name) private improveReadingModel: Model<ImproveReading>,
  ) {}

  async getImproveReadingData( levels: { writing: number; reading: number; grammer: number } ): Promise<ImproveReading[]> {
    try {
      const response = await axios.post(
        'https://www.maeenmodelserver.site/story',
        { levels },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const improveReadingData = response.data; 

    
      const entries = improveReadingData.map(
        (entry: any) => new this.improveReadingModel(entry),
      );
      await this.improveReadingModel.insertMany(entries);

      return entries;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch improve reading data from external API ' +levels,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
