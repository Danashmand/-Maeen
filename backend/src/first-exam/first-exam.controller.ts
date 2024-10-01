import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FirstExamService } from './first-exam.service';
import { CreateFirstExamDto } from './dto/create-first-exam.dto';
import { UpdateFirstExamDto } from './dto/update-first-exam.dto';

@Controller('first-exam')
export class FirstExamController {
  constructor(private readonly firstExamService: FirstExamService) {}

  @Post()
  create(@Body() createFirstExamDto: CreateFirstExamDto) {
    return this.firstExamService.create(createFirstExamDto);
  }

  @Get()
  findAll() {
    return this.firstExamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firstExamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFirstExamDto: UpdateFirstExamDto) {
    return this.firstExamService.update(+id, updateFirstExamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.firstExamService.remove(+id);
  }
}
