import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SpellingCorrectionService {
  constructor(private readonly httpService: HttpService) {}

  async correctSpelling(question: string, levels: { writing: number; reading: number; grammar: number }): Promise<string> {
    const payload = { question, levels };

    try {
      const response: AxiosResponse<{ corrected_text: string }> = await lastValueFrom(
        this.httpService.post('http://www.maeenmodelserver.site/spelling-correction', payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (!response.data || !response.data.corrected_text) {
        throw new Error('No response from spelling correction service');
      }

      return response.data.corrected_text;
    } catch (error) {
      console.error('Error communicating with the spelling correction service', error);
      throw new Error('Failed to get corrected text');
    }
  }
}
