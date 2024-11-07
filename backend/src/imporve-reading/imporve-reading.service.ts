import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { ImproveReading } from './improve-reading.schema';

@Injectable()
export class ImproveReadingService {
  constructor(
    @InjectModel(ImproveReading.name) private improveReadingModel: Model<ImproveReading>,
  ) {}

  async getImproveReadingData(levels: { writing: number; reading: number; grammar: number }): Promise<ImproveReading[]> {
    try {
      const response = await axios.post(
        'https://www.maeenmodelserver.site/story',
        { levels },
        { headers: { 'Content-Type': 'application/json' } },
      );

      const improveReadingData = response.data;

      // Directly insert the data received from the API into MongoDB
      await this.improveReadingModel.insertMany(improveReadingData);

      // Return the inserted data as an array of ImproveReading documents
      return improveReadingData;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch improve reading data from external API: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


// "levels": {"", 10 ""}