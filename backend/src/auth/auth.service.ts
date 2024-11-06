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

  // Updated signUp method to expect level as an object
  async signUp(
    email: string,
    password: string,
    name: string,
    level: { writing?: number; reading?: number; grammer?: number } // Correct type for level
  ): Promise<User> {
    return this.userService.createUser(email, password, name, level);
  }

  // signIn method remains unchanged
  async signIn(email: string, password: string): Promise<{ userData: User }> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await this.userService.validatePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id }; // Assuming 'id' exists on User
    return {
      userData: user,
    };
  }

  // googleLogin method remains unchanged
  async googleLogin(user: any) {
    const payload = {
      email: user.email,
      sub: user._id, // You can use Google profile ID or another identifier
    };

    return this.jwtService.sign(payload);
  }
}
