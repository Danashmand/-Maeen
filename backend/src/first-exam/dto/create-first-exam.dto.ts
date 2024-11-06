// create-first-exam.dto.ts

import { IsString, IsObject } from 'class-validator';

export class CreateFirstExamDto {
  @IsObject()
  levels: { [key: string]: number }; // Example: { writing: 1, reading: 10, grammar: 19 }

  @IsString()
  topic: string;

  @IsString()
  userId: string;
}
