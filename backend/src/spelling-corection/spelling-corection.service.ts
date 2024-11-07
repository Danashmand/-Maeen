import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SpellingCorrectionService {
  constructor(private readonly httpService: HttpService) {}

  async correctSpelling(question: string, levels: { writing: number; reading: number; grammar: number }): Promise<string> {
    const payload = { question, levels };

    interface ChatbotResponse {
      AI: string;
    }

    // Log payload for debugging purposes
    console.log('Payload being sent to spelling correction service:', payload);

    try {
      const response: AxiosResponse<ChatbotResponse> = await lastValueFrom(
        this.httpService.post<ChatbotResponse>('http://www.maeenmodelserver.site/spelling-correction', payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

   

      return response.data.AI;

    } catch (error) {
      // Detailed logging to help debug
      if (error.response) {
        // If the error has a response (like 4xx or 5xx)
        console.error('Error response from spelling correction service:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // If no response was received
        console.error('No response received from spelling correction service:', error.request);
      } else {
        // Other types of errors
        console.error('Error in setting up request:', error.message);
      }

      throw new Error('Failed to get corrected text: ' + error.message);
    }
  }
}
