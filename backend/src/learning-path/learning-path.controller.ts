import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LearningPathService } from './learning-path.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@Controller('learning-path')
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Post()
  create(@Body() createLearningPathDto: CreateLearningPathDto) {
    return this.learningPathService.create(createLearningPathDto);
  }

  @Get()
  findAll() {
    return this.learningPathService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.learningPathService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLearningPathDto: UpdateLearningPathDto) {
    return this.learningPathService.update(+id, updateLearningPathDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.learningPathService.remove(+id);
  }
}
