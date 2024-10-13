import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VirtualTeacherService } from './virtual-teacher.service';
import { CreatevirtualTeacherDto } from './dto/create-virtualTeacher.dto';
import { UpdateVirtualTeacherDto } from './dto/update-virtualTeacher.dto';

@Controller('virtual-teacher')
export class virtualTeacherController {
  constructor(private readonly virtualTeacherService: VirtualTeacherService) {}

  @Post('ask')
  async ask(@Body() body: { prompt: string, userId: string }) {
    const { prompt, userId } = body;

    // Send the user's question to the Flask server via the service
    const answer = await this.virtualTeacherService.askQuestion(prompt, userId);

    // Return the AI response
    return { answer };
  }

  @Get()
  findAll() {
    return this.virtualTeacherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virtualTeacherService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVirtualTeacherDto: UpdateVirtualTeacherDto) {
    return this.virtualTeacherService.update(id, updateVirtualTeacherDto);
  }

 
}
