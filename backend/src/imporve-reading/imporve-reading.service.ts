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
    try {
      const response: AxiosResponse<ImproveReading[]> = await lastValueFrom(
        this.httpService.post<ImproveReading[]>(
          'http://www.maeenmodelserver.site/story',
           levels ,
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );

      // Insert data into MongoDB and return it
      return this.improveReadingModel.insertMany(response.data);
    } catch (error) {
      // Log error details for debugging
      console.error('Error occurred:', error.response || error.request || error.message);
      
      throw new HttpException(
        `Failed to fetch data for levels ${JSON.stringify(levels)}. Error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
