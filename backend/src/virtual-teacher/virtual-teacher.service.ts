import { Injectable } from '@nestjs/common'; // Import only necessary modules
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios'; // Import HttpService
import { CreatevirtualTeacherDto } from './dto/create-virtualTeacher.dto';
import { UpdateVirtualTeacherDto } from './dto/update-virtualTeacher.dto';
import { VirtualTeacher, VirtualTeacherDocument } from './virtual-teacher.schema';
import { lastValueFrom } from 'rxjs'; // Allows handling async/await with observables
import { AxiosResponse } from 'axios'; // Import AxiosResponse type

// Define the expected response type from the Flask server
interface AIResponse {
  AI: string; // The key 'AI' holds the generated response
}

@Injectable()
export class VirtualTeacherService {
  constructor(
    @InjectModel(VirtualTeacher.name) private virtualTeacherModel: Model<VirtualTeacherDocument>,
    private httpService: HttpService // Inject HttpService instead of HttpServer
  ) {}

  // Method to handle conversation with the Flask server
  async askQuestion(prompt: string, userId: string): Promise<string> {
    // Define the payload with the request body and headers
    const payload = {
      question: prompt, // Flask API expects a 'question' field
    };

    try {
      // Send POST request to the Flask server at the /ask endpoint
      const response: AxiosResponse<AIResponse> = await lastValueFrom(
        this.httpService.post<AIResponse>('http://localhost:5000/ask', payload, {
          headers: { 'Content-Type': 'application/json' }, // Set the correct content type
        }),
      );

      // Return the AI's response from the Flask server
      return response.data.AI;
    } catch (error) {
      console.error('Error communicating with the Flask server', error);
      throw new Error('Failed to get response from the Flask server');
    }
  }

  async create(createVirtualTeacherDto: CreatevirtualTeacherDto): Promise<VirtualTeacher> {
    const createdVirtualTeacher = new this.virtualTeacherModel(createVirtualTeacherDto);
    return createdVirtualTeacher.save();
  }

  async findAll(): Promise<VirtualTeacher[]> {
    return this.virtualTeacherModel.find().exec();
  }

  async findOne(id: string): Promise<VirtualTeacher> {
    return this.virtualTeacherModel.findById(id).exec();
  }

  async update(id: string, updateVirtualTeacherDto: UpdateVirtualTeacherDto): Promise<VirtualTeacher> {
    return this.virtualTeacherModel.findByIdAndUpdate(id, updateVirtualTeacherDto, { new: true }).exec();
  }
}
