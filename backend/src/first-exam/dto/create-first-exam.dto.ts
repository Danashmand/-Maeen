import { IsString, IsObject } from 'class-validator';

export class CreateFirstExamDto {
  levels: object;
  topic: string;
}
