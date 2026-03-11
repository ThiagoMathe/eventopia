import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: any) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: any) {
    return this.authService.signIn(dto);
  }
}