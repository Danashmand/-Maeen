import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ImproveReading } from './improve-reading.schema';
import { AxiosResponse } from 'axios';

@Injectable()
export class ImproveReadingService {
  constructor(
    @InjectModel(ImproveReading.name) private improveReadingModel: Model<ImproveReading>,
    private readonly httpService: HttpService,
  ) {}

  async getImproveReadingData(levels: { writing: number; reading: number; grammar: number }): Promise<ImproveReading[]> {
    const payload = { levels };

    try {
      const response: AxiosResponse<Partial<ImproveReading>[]> = await lastValueFrom(
        this.httpService.post<Partial<ImproveReading>[]>('http://www.maeenmodelserver.site/story', payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const improveReadingData = response.data.map(data => ({
          ...data,
          levels, 
      })) as unknown as ImproveReading[];

      // Insert data into MongoDB
      const insertedData = await this.improveReadingModel.insertMany(improveReadingData);

      return insertedData;

    } catch (error) {
      if (error.response) {
        console.error('Error response from improve reading service:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received from improve reading service:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      throw new HttpException(
        `Failed to fetch data from external API for levels: ${JSON.stringify(levels)}. Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
