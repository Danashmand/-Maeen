export class CreateFirstExamDto {
  userId: string;
  levels: { [key: string]: number };  // Levels as an object, e.g., { writing: 1, reading: 10, grammer: 19 }
  topic: string;
}
