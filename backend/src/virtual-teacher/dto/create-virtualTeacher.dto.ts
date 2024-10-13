import { IsNotEmpty, IsString } from 'class-validator';

export class CreatevirtualTeacherDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly prompt: string;

  

}
