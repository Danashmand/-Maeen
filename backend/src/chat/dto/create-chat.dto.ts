import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly prompt: string;

  @IsNotEmpty()
  @IsString()
  readonly answer: string;
}
