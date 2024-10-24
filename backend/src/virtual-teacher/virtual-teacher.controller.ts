import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VirtualTeacherService } from './virtual-teacher.service';
import { CreatevirtualTeacherDto } from './dto/create-virtualTeacher.dto';
@Controller('virtual-teacher')
export class VirtualTeacherController {
  constructor(private readonly virtualTeacherService: VirtualTeacherService) {}

  @Post('start-session')
  async startChatSession(@Body() body: { userId: string }) {
    const ChatSesstion= await this.virtualTeacherService.startNewChatSession(body.userId);
    console.log(ChatSesstion.chatId);
    return {ChatId: ChatSesstion.chatId};
  }

  @Post('ask')
  async ask(@Body() createvirtualTeacherDto: CreatevirtualTeacherDto) {
    return this.virtualTeacherService.handleUserQuery(createvirtualTeacherDto);
  }

  @Post('history')
  async getChatHistory(@Body() body: { userId: string, chatId: string }) {
    return this.virtualTeacherService.getChatHistory(body.userId, body.chatId);
  }
@Get('All')
  async getAllChats(){
    return this.virtualTeacherService.findAll();
  }

  @Get(':chatId')
  async getChatById(@Param('chatId') chatId: string) {
    return this.virtualTeacherService.getChatById(chatId);
  }
}
