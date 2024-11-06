import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    // Pass level as an object with default values
    return this.authService.signUp(email, password, name, {
      writing: 0,  // Default value for writing
      reading: 0,  // Default value for reading
      grammar: 0   // Default value for grammar
    });
  }

  @Post('signin')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signIn(email, password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Google redirect will happen automatically
  }

  // Google redirects back to this route after authentication
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const jwt = await this.authService.googleLogin(req.user);
    res.cookie('user', jwt, { httpOnly: true });  // Example of setting a cookie
    res.redirect(`http://localhost:3000/auth/getmail`); // Redirect to dashboard
  }
}
