import { Injectable, NotFoundException } from '@nestjs/common';
import { VirtualTeacher, VirtualTeacherDocument } from './virtual-teacher.schema';
import { CreatevirtualTeacherDto } from './dto/create-virtualTeacher.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { User, UserDocument } from '../users/users.schema';
import { lastValueFrom } from 'rxjs';

interface ChatbotResponse {
  AI: string;
}

@Injectable()
export class VirtualTeacherService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(VirtualTeacher.name) private readonly virtualTeacherModel: Model<VirtualTeacherDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async startNewChatSession(userId: string) {
    const chatId = `chat_${Date.now()}`;

    try {
      await lastValueFrom(this.httpService.post('http://www.maeenmodelserver.site/reset', {}));
      console.log('Conversation history reset successfully.');
    } catch (error) {
      console.error('Failed to reset conversation history', error);
      throw new Error('Could not reset conversation history');
    }

    const newChatSession = new this.virtualTeacherModel({
      userId,
      chatId,
      messages: [],
      createdAt: new Date(),
    });

    try {
      await newChatSession.save();
      return newChatSession;
    } catch (error) {
      throw new Error('Failed to create new chat session');
    }
  }

  async handleUserQuery(createvirtualTeacherDto: CreatevirtualTeacherDto) {
    const { prompt, userId, chatId } = createvirtualTeacherDto;

    const chatbotResponse = await this.getChatbotResponse(prompt, userId, 'ask'); // Default to 'ask' for Virtual Assistant

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

    const chatSession = await this.virtualTeacherModel.findOne({ userId, chatId });
    if (chatSession) {
      chatSession.messages.push(userMessage, chatbotMessage);
      await chatSession.save();
      await this.updateUserScore(userId);

      return chatbotMessage;
    } else {
      throw new Error('Chat session not found');
    }
  }

  private async updateUserScore(userId: string, skill: 'writing' | 'reading' | 'grammar' = 'writing') {
    const user = await this.userModel.findById(userId);
    if (user) {
      user.levels[skill] = (user.levels[skill] || 0) + 10;
      await user.save();
    } else {
      throw new Error('User not found');
    }
  }

  async getChatHistory(userId: string, chatId: string) {
    if (!userId || !chatId) {
      console.warn(`Invalid parameters: userId=${userId}, chatId=${chatId}. Returning empty array.`);
      return [];
    }
    const chatSession = await this.virtualTeacherModel.findOne({ userId, chatId });

    if (chatSession) {
      return chatSession.messages;
    } else {
      console.warn("Chat session not found for userId:", userId, "and chatId:", chatId);
      throw new Error('Chat session not found');
    }
  }

  async getChatById(chatId: string) {
    return this.virtualTeacherModel.findOne({ chatId });
  }

  private async getChatbotResponse(prompt: string, userId: string, serviceType: 'ask' ): Promise<string> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const payload = {
      question: prompt,
      levels: {
        writing: user.levels?.writing ?? 1,
        reading: user.levels?.reading ?? 1,
        grammar: user.levels?.grammar ?? 1,
      },
    };
  
    const endpoint =  'http://www.maeenmodelserver.site/ask';
  
    try {
      const response: AxiosResponse<ChatbotResponse> = await lastValueFrom(
        this.httpService.post<ChatbotResponse>(endpoint, payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );
  
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
    const allChats = await this.virtualTeacherModel.find();
    return allChats;
  }

  async findChatsByUserId(userId: string) {
    const chatHistory = await this.virtualTeacherModel.find({ userId });
    if (!chatHistory || chatHistory.length === 0) {
      throw new NotFoundException(`No chat history found for user ID ${userId}`);
    }
    return chatHistory;
  }
}
