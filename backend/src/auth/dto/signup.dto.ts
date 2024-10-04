// src/auth/dto/signup-auth.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;
}
