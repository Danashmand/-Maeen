// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { User } from '../users/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signUp(email: string, password: string, name: string,level:string): Promise<User> {

    return this.userService.createUser(email, password, name,level);
  }

  async signIn(email: string, password: string): Promise<{  userData: User }> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await this.userService.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    return {
    
      userData: user, 
    };
  }
  async googleLogin(user: any) {
    const payload = {
      email: user.email,
      sub: user._id, // You can use Google profile ID or another identifier
    };

    return this.jwtService.sign(payload);
  }
}
