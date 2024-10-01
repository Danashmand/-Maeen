import { Injectable } from '@nestjs/common';
import { CreateFirstExamDto } from './dto/create-first-exam.dto';
import { UpdateFirstExamDto } from './dto/update-first-exam.dto';

@Injectable()
export class FirstExamService {
  create(createFirstExamDto: CreateFirstExamDto) {
    return 'This action adds a new firstExam';
  }

  findAll() {
    return `This action returns all firstExam`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firstExam`;
  }

  update(id: number, updateFirstExamDto: UpdateFirstExamDto) {
    return `This action updates a #${id} firstExam`;
  }

  remove(id: number) {
    return `This action removes a #${id} firstExam`;
  }
}
