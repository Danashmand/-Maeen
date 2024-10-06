// src/auth/dto/signin-auth.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
