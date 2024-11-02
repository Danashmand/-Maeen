// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../users/users.service'; // Import the UserService
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userService: UserService  // Inject the UserService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'https://maeen-production.up.railway.app/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, id } = profile;

    // Check if the user already exists in the database by email
    let user = await this.userService.findByEmail(emails[0].value);

    if (!user) {
      // Create new user if not found
      user = await this.userService.createUserGoogle({
        email: emails[0].value,
        name: name.givenName ,
        password: '123456789',  // No password for Google users
        level: 'user', // Default level for new users (can be changed)
      });
    }

    done(null, user);  // Return the user to the Passport session
  }
}
