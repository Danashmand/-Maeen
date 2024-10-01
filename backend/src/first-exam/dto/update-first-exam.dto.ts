import { PartialType } from '@nestjs/mapped-types';
import { CreateFirstExamDto } from './create-first-exam.dto';

export class UpdateFirstExamDto extends PartialType(CreateFirstExamDto) {}
