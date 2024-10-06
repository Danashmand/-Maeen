// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'mySuperSecretKey', // Store securely in real apps
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule.register({ defaultStrategy: 'google' })
  ],
  providers: [AuthService, JwtStrategy,GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
