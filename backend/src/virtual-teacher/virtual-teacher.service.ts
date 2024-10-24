import { Injectable } from '@nestjs/common';
import { VirtualTeacher, VirtualTeacherDocument } from './virtual-teacher.schema'; // Adjust the path as necessary
import { CreatevirtualTeacherDto } from './dto/create-virtualTeacher.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

interface ChatbotResponse {
  AI: string;
}
import { lastValueFrom } from 'rxjs';

@Injectable()
export class VirtualTeacherService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(VirtualTeacher.name)  private readonly virtualTeacherModel: Model<VirtualTeacherDocument>,
  ) {}

  async startNewChatSession(userId: string) {
    const chatId = `chat_${Date.now()}`; // Create a unique chatId (this should be a string)
    
    // Log the chatId to ensure it's being created correctly
  
    const newChatSession = new this.virtualTeacherModel({
      userId,
      chatId, // Ensure this is a string
      messages: [], // Initialize messages as an empty array
      createdAt: new Date(),
    });
  
    // Attempt to save the new chat session and handle potential errors
    try {
      await newChatSession.save();
      return newChatSession;
    } catch (error) {
      throw new Error('Failed to create new chat session');
    }
  }
  

  async handleUserQuery(createvirtualTeacherDto: CreatevirtualTeacherDto) {
    const { prompt, userId, chatId } = createvirtualTeacherDto;

    // Generate chatbot response (use your existing method)
    const chatbotResponse = await this.getChatbotResponse(prompt, userId);


    const userMessage = {
      text: prompt,
      source: 'user' as 'user',
      createdAt: new Date(),
    };

    const chatbotMessage = {
      text: chatbotResponse,
      source: 'chatbot' as 'chatbot',
      createdAt: new Date(),
    };

    // Find the chat session by userId and chatId
    const chatSession = await this.virtualTeacherModel.findOne({ userId, chatId });
    if (chatSession) {
      // Append the new messages
      chatSession.messages.push(userMessage, chatbotMessage);
      await chatSession.save();
      return chatbotMessage;
    } else {
      throw new Error('Chat session not found');
    }
  }

  // Retrieve chat history by chatId (or userId)
  async getChatHistory(userId: string, chatId: string) {
    if (!userId || !chatId) {
      console.warn(`Invalid parameters: userId=${userId}, chatId=${chatId}. Returning empty array.`);
      return []; // or return an appropriate default response
  }
    const chatSession = await this.virtualTeacherModel.findOne({ userId, chatId });
  
    if (chatSession) {
      console.log("Chat session found:", chatSession);
      return chatSession.messages;
    } else {
      console.warn("Chat session not found for userId:", userId, "and chatId:", chatId);
      throw new Error('Chat session not found');
    }
  }
  

  async getChatById(chatId: string) {
    return this.virtualTeacherModel.findOne({ chatId });
  }
  private async getChatbotResponse(prompt: string, userId: string): Promise<string> {
    const payload = {
      question: prompt,
      userId: userId, // Include userId in the payload if needed
    };

    try {
      // Make the request to the Flask server
      const response: AxiosResponse<ChatbotResponse> = await lastValueFrom(
        this.httpService.post<ChatbotResponse>('http://localhost:5000/ask', payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // Ensure response from AI is valid
      if (!response.data || !response.data.AI) {
        throw new Error('No response from AI');
      }

      return response.data.AI;
    } catch (error) {
      console.error('Error communicating with the Flask server', error);
      throw new Error('Failed to get response from the Flask server');
    }
  }


  async findAll() {
    const allChats= await this.virtualTeacherModel.find();
    console.log(allChats);
    return allChats;
    
  }
}