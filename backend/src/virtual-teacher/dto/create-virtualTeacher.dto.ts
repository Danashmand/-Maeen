import { IsString, IsNotEmpty } from 'class-validator';

export class CreatevirtualTeacherDto {
  @IsString()
  @IsNotEmpty()
 readonly prompt: string;

  @IsString()
  @IsNotEmpty()
  readonly  userId: string;

  @IsString()
  @IsNotEmpty()
  readonly chatId: string;
}
