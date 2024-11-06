import { Controller, Post, Body } from '@nestjs/common';
import { FirstExamService } from './first-exam.service';
import { CreateFirstExamDto } from './dto/create-first-exam.dto';

@Controller('first-exam')
export class FirstExamController {
  constructor(private readonly firstExamService: FirstExamService) {}

  @Post()
  async create(@Body() createFirstExamDto: CreateFirstExamDto) {
    return this.firstExamService.create(createFirstExamDto);
  }
}
